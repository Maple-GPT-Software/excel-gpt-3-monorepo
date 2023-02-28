/// <reference types="stripe-event-types" />
/** NPM */
import express from 'express';
import Stripe from 'stripe';
import helmet from 'helmet';
import xss from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cors from 'cors';
import httpStatus from 'http-status';
import config from '@src/config/config';
import * as morgan from '@src/config/morgan';
/** Middlewares */
import firebaseAuth from '@src/middleware/firebaseAuth';
import { errorHandler, errorConverter } from './middleware/error';
// import { authLimiter } from "./middlewares/rateLimiter";
/** Modules */
import AppRoutes from '@src/routes';
import ApiError from '@src/utils/ApiError';
import * as stripeService from '@src/services/stripe.service';
import logger from './config/logger';
import stripe from './config/stripe';

// TODO: only allow specific origins
// const corsOptions = {
//   origin: [
//     "localhost:3000",
//     ""
//   ]
// }

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// set security HTTP headers
app.use(helmet());

// https://codingpr.com/stripe-webhook/
app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
  const sig = request.headers['stripe-signature'] as string | string[];

  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, config.stripeEndpointSecret) as Stripe.DiscriminatedEvent;
  } catch (error: unknown) {
    // @ts-ignore
    response.status(400).send(`Webhook Error: ${error.message}`);
    return;
  }

  switch (event.type) {
    /**
     * we create customer account from client after the user is successfully authenticated by firebase
     */
    case 'customer.created':
      const customer = event.data.object;

      if (!customer.email) {
        // something has gone horribly wrong
        logger.debug('Stripe webhook [customer.created] missing email');
        break;
      }

      console.log('[customer.created] stripe customer ID ', customer.id);
      stripeService.addCustomerId(customer.email, customer.id);
      break;
    /**
     * When a user starts a trial or subscribes to premium after trial expiration.
     *  - trial starts, status: trialing
     *  - subscribes to premium afer trial ends, stauts: active
     */
    case 'customer.subscription.created':
      // TODO: email user with thank you, installation guide
      const createdSubscription = event.data.object;
      console.log(`customer.subscription.created customer ID `, createdSubscription.customer);
      stripeService.addSubscription(
        createdSubscription.customer as string,
        createdSubscription.current_period_end,
        createdSubscription.status
      );
      break;
    /**
     * Subscriptions are updated when card info changes, switching from trial to premium
     *  - invoice succeeds, status: active
     *  - invoice fails, status: past_due.
     *  - switched to premium invoice succeeds, status: active
     *  - switched to premium invoice failed. status: past_due
     *  - switched to premium during trial period, status: active
     */
    case 'customer.subscription.updated':
      const updatedSubscription = event.data.object;
      console.log(`customer.subscription.updated customer ID`, updatedSubscription.customer);
      stripeService.updateSubscription(updatedSubscription.customer as string, updatedSubscription.status);
      break;
    /**
     * When a user cancels their subscription. We only allow "cancel immediately"
     *  - status: canceled
     */
    case 'customer.subscription.deleted':
      // TODO: email user for feedback as to why they are cancelling
      const deletedSubscription = event.data.object;
      console.log('customer.subscription.deleted customerID', deletedSubscription.customer, deletedSubscription.status);
      stripeService.updateSubscription(deletedSubscription.customer as string, deletedSubscription.status);
      break;

    /** We set the checkout lifespan to 30 minutes. We can use this to follow up with the user  */
    // case 'checkout.session.expired':
    default:
      break;
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
});

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

/**
 * thise
 */
app.use(firebaseAuth);

// FUTURE_WORK: refactor this middleware to allow email + password signup
// app.use(passport.initialize());
// passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//   app.use('/v1/auth', authLimiter);
// }

// v1 api routes
app.use('/', AppRoutes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError if this middleware doens't catch typeof ApiError
app.use(errorConverter);

// returns error using appropriate httpstatus and message
app.use(errorHandler);

export default app;

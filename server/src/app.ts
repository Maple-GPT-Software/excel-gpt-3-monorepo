/// <reference types="stripe-event-types" />
/** NPM */
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import httpStatus from 'http-status';
import express from 'express';
import xss from 'xss-clean';
import Stripe from 'stripe';
import helmet from 'helmet';
import cors from 'cors';

import { errorHandler, errorConverter } from './middleware/error';
import toJSONMiddleware from './middleware/toJSONMiddleware';
import * as stripeService from './services/stripe.service';
/** Middlewares */
import firebaseAuth from './middleware/firebaseAuth';
import * as morgan from './config/morgan';
import { StripeWebhooks } from './types';
import ApiError from './utils/ApiError';
import config from './config/config';
import logger from './config/logger';
import stripe from './config/stripe';
// FUTURE: rate limiting
// import { authLimiter } from "./middlewares/rateLimiter";
/** Modules */
import AppRoutes from './routes';
// !IMPORTANT start server with pm2

// TODO: only allow specific origins
// const corsOptions = {
//   origin: [
//     "localhost:3000",
//     ""
//   ]
// }

const app = express();

// TODO: morgan setup logs?
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
    // verifying the signature sent by Stripe
    event = stripe.webhooks.constructEvent(request.body, sig, config.stripeEndpointSecret) as Stripe.DiscriminatedEvent;
  } catch (error: unknown) {
    // @ts-expect-error we don't need to type this
    logger.debug(`⚠️  Webhook signature verification failed.`, error.message);
    response.status(400).send();
    return;
  }

  switch (event.type) {
    case StripeWebhooks.CustomerCreated:
      const customer = event.data.object;
      // note: customer.email is string|null but when we create the customer with Stripe
      // we specify the user's email that should be used to uniquely identify the customer
      stripeService.addCustomerId(customer.email as string, customer.id);
      break;
    // TODO: only update lifetime payment id if 1) unset, 2) payment is for lifetime access
    case StripeWebhooks.PaymentSucceeded:
      stripeService.updateLifetimeAccessPayment(event.data.object);
      break;
    case StripeWebhooks.SubscriptionCreated:
      // FUTURE: email user with thank you, installation guide
      stripeService.updateSubscription(event.data.object);
      break;
    case StripeWebhooks.SubscriptionUpdated:
      stripeService.updateSubscription(event.data.object);
      break;
    case StripeWebhooks.SubscriptionDeleted:
      // FUTURE: email user for feedback as to why they are cancelling
      stripeService.updateSubscription(event.data.object);
      break;

    // FUTURE: https://stripe.com/docs/api/events/types#event_types-customer.subscription.trial_will_end

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

app.use('/api/v1/', AppRoutes);

app.use(toJSONMiddleware);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError if this middleware doens't catch typeof ApiError
app.use(errorConverter);

// returns error using appropriate httpstatus and message
app.use(errorHandler);

export default app;

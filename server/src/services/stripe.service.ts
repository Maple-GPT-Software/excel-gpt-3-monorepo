import httpStatus from 'http-status';
import Stripe from 'stripe';

import { Document } from 'mongoose';

import { User } from '../models/user.model';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';
import stripe from '../config/stripe';
import settings from '../settings';
import { DUser } from '../types';

interface SessionBase {
  /** price id from Stripe dashboard UI */
  priceId: string;
  successUrl: string;
  cancelUrl: string;
  quantity?: number;
}

/**
 * This method is uses stripe's API to create:
 *  1) a customer profile w user's email
 *  2) a free 5 day subscription with the premium subscription id
 * We don't need to save the stripe properties in our DB at this point because we use Stripe's
 * webhook to subscribe to certain events. see `app.ts`
 */
export const createCustomerWithFreeTrial = async (email: string) => {
  try {
    const customer = await stripe.customers.create({ email });

    stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: settings.stripePriceIds.premiumMonthly }],
      trial_period_days: 7,
      cancel_at_period_end: true,
      proration_behavior: 'none',
    });
  } catch (error) {
    logger.debug('#createCustomerWithFreeTrial ', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while making stripe account');
  }
};

/** creates a Stripe subscription checkout */
export const createSubscriptionSession = async (stripeCustomerId: string, options: SessionBase) => {
  const { successUrl, cancelUrl, priceId, quantity = 1 } = options;
  try {
    // const user = await User.findOne({ email });
    // https://stripe.com/docs/api/checkout/sessions/create?lang=node
    const session = await stripe.checkout.sessions.create({
      success_url: successUrl,
      cancel_url: cancelUrl,
      /** our webhooks depend on stripe customer id */
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: 'subscription',
      currency: 'usd',
      metadata: {
        priceId,
      },
      // expires in 30 minutes from now as unix timestamp in seconds
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return session;
  } catch (error) {
    // Stripe was not able to create a checkout session for whatever reason
    logger.error('#createSubscriptionSession failed', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to checkout with Stripe');
  }
};

export const createPaymentSession = async (stripeCustomerId: string, options: SessionBase) => {
  const { successUrl, cancelUrl, priceId, quantity = 1 } = options;
  try {
    const session = await stripe.checkout.sessions.create({
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer: stripeCustomerId,
      line_items: [
        {
          price: priceId,
          quantity,
        },
      ],
      mode: 'payment',
      currency: 'usd',
      payment_intent_data: {
        metadata: {
          priceId,
        },
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return session;
  } catch (error) {
    // Stripe was not able to create a checkout session for whatever reason
    logger.error('#createSubscriptionSession failed', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to checkout with Stripe');
  }
};

// TODO: separate functions for subscription and payment API calls

/**
 * Called when user wants to cancel their subscription. We will cancel their
 * subscription immediately, if we do it client side the user can arbitrary params to Stripe
 * that's why we do it server side
 */
export const cancelSubscriptionById = async (email: string, id: string) => {
  try {
    // TODO: revise this only users with subscriptions cancel, just
    const customer = (await stripe.customers.list({ email, limit: 1 })).data.length;

    // at this point, in the client app, the user is authenticated
    // and they shoud only be requesting to delete a subscription they see in their UI
    // we don't really need this check?
    if (customer !== 1) {
      throw new ApiError(httpStatus.NOT_FOUND, 'You do not have a payments account');
    }

    await stripe.subscriptions.del(id);
  } catch (error) {
    logger.notice('Error while cancelling subcription ', error, email, id);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};

/** When webhook receives customer.created event */
export const addCustomerId = async (email: string, stripeCustomerId: string) => {
  User.findOneAndUpdate({ email }, { stripeCustomerId }).catch((e) => {
    logger.notice('#addCustomerId unable to add stripe customer id on User', stripeCustomerId, e);
  });
};

/** when webhook receives subscription.created event */
export const updateSubscription = async (subscription: Stripe.Subscription) => {
  const { customer: stripeCustomerId, current_period_end: stripeCurrentPeriodEnd, status: stripeStatus } = subscription;
  User.findOneAndUpdate({ stripeCustomerId }, { stripeCurrentPeriodEnd, stripeStatus }).catch((e) => {
    logger.notice('#addSubscription unable to update stripe subscription', subscription, e);
  });
};

/**
 * when webhook receives payment_intent.succeeded, we only save the payment intent id if
 * payment was successful
 */
export const updateLifetimeAccessPayment = async (paymentIntent: Stripe.PaymentIntent) => {
  const { customer: stripeCustomerId, metadata } = paymentIntent;
  const user = await User.findOne({ stripeCustomerId });

  /** we fail silently, this should never happen because we create stripe customerid on signup */
  if (!user) {
    return;
  }

  if (metadata?.priceId === settings.stripePriceIds.lifetimeChatAccess) {
    updateLifetimeAccess(paymentIntent, user);
  }
};

/** updates the lifetime access payment intent ID on the user's profile */
const updateLifetimeAccess = async (
  paymentIntent: Stripe.PaymentIntent,
  user: Document<unknown, any, DUser> &
    Omit<
      DUser & {
        _id: any;
      },
      never
    >
) => {
  const { id: paymentIntentId } = paymentIntent;

  if (user.stripeLifetimeAccessPaymentId !== '') {
    logger.notice('#updateLifetimeAccess user already has lifetime access', user.email);
  }

  console.log('updating user profile');
  user.updateOne({ stripeLifetimeAccessPaymentId: paymentIntentId }).catch((e) => {
    logger.notice('#updateLifetimeAccess unable to update user profile', paymentIntent, user.email, e);
  });
};

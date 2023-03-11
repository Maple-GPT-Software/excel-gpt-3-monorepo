import Stripe from 'stripe';
import logger from '@src/config/logger';
import { User } from '@src/models/user.model';
import stripe from '@src/config/stripe';
import ApiError from '@src/utils/ApiError';
import httpStatus from 'http-status';
import config from '@src/config/config';
import { PRICE_IDS } from '@src/constants';

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
      items: [{ price: PRICE_IDS.STANDALONE_MONTHLY }],
      trial_period_days: 5,
      cancel_at_period_end: true,
      proration_behavior: 'none',
    });
  } catch (error) {
    logger.debug('#createCustomerWithFreeTrial ', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while making stripe account');
  }
};

/**
 * 1) user completes checkout session: Customer object created, Subscription is created
 * 2) user complets checkout, redirected to success_url (client app)
 * 3) user clicks on cancel_url, is navigated back to client and clients makes API call to create free trial
 */
export const createSessionByProductId = async (email: string, priceId: string) => {
  try {
    // https://stripe.com/docs/api/checkout/sessions/create?lang=node
    const session = await stripe.checkout.sessions.create({
      success_url: config.clients.webappCheckoutSuccessUrl,
      cancel_url: config.clients.webappCheckoutCancelledUrl,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      currency: 'usd',
      // stripe will use this email when creating the Customer object
      customer_email: email,
      // expires in 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return session;
  } catch (error) {
    // Stripe was not able to create a checkout session for whatever reason
    logger.error('#createSessionByProductId failed', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to checkout with Stripe');
  }
};

/**
 * Called when user wants to cancel their subscription. We will cancel their
 * subscription immediately, if we do it client side the user can arbitrary params to Stripe
 * that's why we do it server side
 */
export const cancelSubscriptionById = async (email: string, id: string) => {
  try {
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

// FUTURE_WORK: if any of these fail how do we approach syncing properties with those in Stripe's DB

/** When webhook receives customer.created event */
export const addCustomerId = async (email: string, stripeCustomerId: string) => {
  User.findOneAndUpdate({ email }, { stripeCustomerId }).catch((e) => {
    logger.notice('#addCustomerId unable to add stripe customer id on User', stripeCustomerId, e);
  });
};

/** when webhook receives subscription.created event */
export const updateSubscription = async (subscription: Stripe.Subscription) => {
  const { customer, current_period_end, status } = subscription;
  User.findOneAndUpdate({ customer }, { current_period_end, status }).catch((e) => {
    logger.notice('#addSubscription unable to update stripe subscription', customer, e);
  });
};

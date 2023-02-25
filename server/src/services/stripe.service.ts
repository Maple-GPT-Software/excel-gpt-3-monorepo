import Stripe from 'stripe';
import logger from '@src/config/logger';
import { User } from '@src/models/user.model';
import stripe from '@src/config/stripe';
import ApiError from '@src/utils/ApiError';
import httpStatus from 'http-status';

enum SUBSCRIPTIONS {
  // this is the price_id for the premium subscription, 5.99$ per month for standalone accounts
  // we use it to create a free_trial subscription without accepting payment info
  STANDALONE_MONTHLY = 'price_1MdLWWGB7M3KTCGBlQufaDuk',
  // other price ids e.g, standalone yearly, team monthly, team yearly
}

/**
 * This method only gets used when the user has created their account for the first time.
 * The client apps send an access token to the server, which we validate with firebase's admin SDK.
 * This method is only repsonsbile for calling stripe's API to create:
 *  1) a customer profile w user's email
 *  2) a free 5 day subscription with the appropriate product id (managed in Stripe UI)
 * We don't need to save the stripe properties in our DB at this point because we use Stripe's
 * webhook to subscribe to certain events. see `app.ts`
 */
export const createCustomerWithFreeTrial = async (email: string) => {
  try {
    const customer = await stripe.customers.create({ email });

    stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: SUBSCRIPTIONS.STANDALONE_MONTHLY }],
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
    logger.debug('Error while cancelling subcription ', error, email, id);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }
};

// TODO: if any of these fail how do we approach syncing properties with those in Stripe's DB

/** When webhook receives customer.created event */
export const addCustomerId = async (email: string, stripeCustomerId: string) => {
  try {
    await User.findOneAndUpdate({ email }, { stripeCustomerId }, { new: true });
    // console.log('#addCustomerId user updated', user);
  } catch (error) {
    logger.debug('#addCustomerId unable to add stripe customer id on User');
  }
};

/** when webhook receives subscription.created event */
export const addSubscription = async (
  stripeCustomerId: string,
  stripeCurrentPeriodEnd: number,
  stripeStatus: Stripe.Subscription.Status
) => {
  try {
    await User.findOneAndUpdate({ stripeCustomerId }, { stripeCurrentPeriodEnd, stripeStatus }, { new: true });
    // console.log('#addSubscription user updated', user);
  } catch (error) {
    logger.debug('#addSubscription unable to add stripe subscription');
  }
};

/** when webhook receives updated / deleted event */
export const updateSubscription = async (stripeCustomerId: string, stripeStatus: Stripe.Subscription.Status) => {
  try {
    await User.findOneAndUpdate({ stripeCustomerId }, { stripeStatus }, { new: true });
    // console.log('#updateSubscription user updated', user);
  } catch (error) {
    logger.debug('#updateSubscription unable to update stripe status');
  }
};

import Stripe from 'stripe';
import logger from '@src/config/logger';
import { User } from '@src/models/user.model';
import stripe from '@src/config/stripe';
import ApiError from '@src/utils/ApiError';
import httpStatus from 'http-status';

// products/prod_NO7mPgB10yViuc
// this is the price_id for the 5.99/month pricing but we can use it
// to create a free_trial subscription
const STRIPE_DEFAULT_PRICE_ID = 'price_1MdLWWGB7M3KTCGBlQufaDuk';

/**
 * This method only gets used when the user has created their account for the first time.
 * The client apps send an access token to the server, which we validate with firebase's admin SDK.
 * This method is only repsonsbile for calling stripe's API to create
 *  1) a customer profile w user's email
 *  2) a free 5 day subscription with the appropriate product id (managed in Stripe UI)
 * We don't need to add the stripe properties that we're interested in because we use Stripe's
 * webhook to subscribe to certain events. see `app.ts`
 */
export const createCustomerWithFreeTrial = async (email: string) => {
  try {
    const customer = await stripe.customers.create({ email });

    const subcription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: STRIPE_DEFAULT_PRICE_ID }],
      trial_period_days: 5,
      cancel_at_period_end: true,
      proration_behavior: 'none',
    });

    console.log('subscription successfully created', subcription);
    return { stripeStatus: subcription.status, stripeCurrentPeriodEnd: subcription.current_period_end };
  } catch (error) {
    logger.debug('#createCustomerWithFreeTrial ', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Error while making stripe account');
  }
};

// TODO: if any of these fail how do we approach syncing properties with those in Stripe's DB
export const addCustomerId = async (email: string, stripeCustomerId: string) => {
  try {
    console.log('add customer id to user ', email);
    const user = await User.findOneAndUpdate({ email }, { stripeCustomerId }, { new: true });
    console.log('#addCustomerId ', user);
  } catch (error) {
    logger.debug('#addCustomerId unable to add stripe customer id on User');
  }
};

export const addSubscription = async (
  stripeCustomerId: string,
  stripeCurrentPeriodEnd: number,
  stripeStatus: Stripe.Subscription.Status
) => {
  try {
    console.log('#addSubscription', stripeCustomerId);
    const user = await User.findOneAndUpdate({ stripeCustomerId }, { stripeCurrentPeriodEnd, stripeStatus }, { new: true });
    console.log('#addSubscription', user);
  } catch (error) {
    logger.debug('#addSubscription unable to add stripe subscription');
  }
};

export const updateSubscription = async (stripeCustomerId: string, stripeStatus: Stripe.Subscription.Status) => {
  try {
    const user = await User.findOneAndUpdate({ stripeCustomerId }, { stripeStatus }, { new: true });
    console.log('#updateSubscription ', user);
  } catch (error) {
    logger.debug('#updateSubscription unable to update stripe status');
  }
};

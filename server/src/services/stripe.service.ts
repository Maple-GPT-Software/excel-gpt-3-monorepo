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
 * 4) defaults to payment mode unless options.mode is specified
 */
export const createSessionByPricetId = async (
  email: string,
  priceId: string,
  options: { mode?: Stripe.Checkout.SessionCreateParams.Mode; successUrl: string; cancelUrl: string }
) => {
  try {
    const user = await User.findOne({ email });
    // https://stripe.com/docs/api/checkout/sessions/create?lang=node
    const session = await stripe.checkout.sessions.create({
      success_url: options.successUrl,
      cancel_url: options.cancelUrl,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: options?.mode ?? 'payment',
      currency: 'usd',
      // TODO: we can pass in customer_email if we want Stripe to create a customer for
      // different session types, e.g subscription
      // for now we use this to create a checkout session for lifetime acces after the user's trial has started
      customer: user?.stripeCustomerId,
      // expires in 30 minutes
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
    });

    return session;
  } catch (error) {
    // Stripe was not able to create a checkout session for whatever reason
    logger.error('#createSessionByPricetId failed', error);
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
  const { customer: stripeCustomerId, status, id } = paymentIntent;

  const user = await User.findOne({ stripeCustomerId });

  if (user === null || user?.stripeLifetimeAccessPaymentId || status !== 'succeeded') {
    logger.warn('Error while updateLifetimeAccessPayment', stripeCustomerId, status);
  }

  user?.update({ stripeLifetimeAccessPaymentId: id }).catch((e) => {
    logger.notice('#updateLifetimeAccessPayment unable to update user profile', paymentIntent, e);
  });
};

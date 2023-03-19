import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import Stripe from 'stripe';

import ApiError from '@src/utils/ApiError';
import { User, UserType } from '@src/models/user.model';

/**
 * This checks if the user is permitted to access resources that require an active or trialing subsciption
 * see isStripeSubscriptionInvalid
 */
const subscriptionCheck: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.decodedFirebaseToken;

    // this middleware is only used for routes where the user is logged in
    // do we need to 1) check if user exists, 2) throw error if user === null
    const user = (await User.findOne({ email })) as UserType;

    // @ts-expect-error keeping this for later
    if (isSubscriptionInvalid(user?.stripeCurrentPeriodEnd, user?.stripeStatus)) {
      next(new ApiError(httpStatus.FORBIDDEN, 'Your subscription has expired'));
    }

    // @ts-expect-error keeping this for later
    req.isPremiumUser = user.stripeStatus === 'active' || user.stripeStatus === 'canceled';
    next();
  } catch (error: any) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to retrieve your account'));
  }
};

export default subscriptionCheck;

/** Checks if the current subscription is invalid. Canceled subscriptions are good until current date > current period end */
export function isSubscriptionInvalid(
  stripeCurrentPeriodEnd: number | undefined,
  stripeStatus: Stripe.Subscription.Status | undefined
) {
  // user has no subscription this should never happen but these are optional properties on the model
  if (!stripeCurrentPeriodEnd || !stripeStatus) {
    return true;
  }

  /**
   * Stripe's current period end is a Unix timestamp (seconds since epoch), so it has no timezone information
   * the calculation above is valid regardless of the timezone the server is in
   */
  const hasCurrentPeriodExpired = stripeCurrentPeriodEnd - getCurrentUnixSeconds() < 0;

  if (hasCurrentPeriodExpired || stripeStatus === 'past_due') {
    return true;
  } else if (stripeStatus === 'trialing' || stripeStatus === 'active' || stripeStatus === 'canceled') {
    // subscription can be cancelled but we permit access to APIs until current date > currentPeriodEnd
    return false;
  }

  return true;
}

/**
 * get the current time as seconds since epoch
 */
export function getCurrentUnixSeconds() {
  return Math.floor(Date.now() / 1000);
}

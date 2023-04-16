import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import Stripe from 'stripe';

import { User } from '../models/user.model';
import ApiError from '../utils/ApiError';
import { DUser } from '../types';

/**
 * This middleware is used for request made to messages to check if free trial users still have access to use chat
 * and adds hasLifetimeAccess to req for dailyMessagesLimiter
 */
// TODO: refactor this to only check if the user has enough credits to make a request
export const lifetimeAccessCheck: RequestHandler = async (req, res, next) => {
  try {
    const { email } = req.decodedFirebaseToken;

    const { stripeLifetimeAccessPaymentId, stripeCurrentPeriodEnd, stripeStatus } = (await User.findOne({
      email,
    })) as DUser;

    if (stripeLifetimeAccessPaymentId !== '') {
      req.hasLifetimeAccess = true;

      next();
      return;
    }

    if (isStripeSubscriptionInvalid(stripeCurrentPeriodEnd, stripeStatus)) {
      next(new ApiError(httpStatus.FORBIDDEN, 'Your subscription has expired'));
    }

    next();
  } catch (error: any) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to retrieve your account'));
  }
};

/**
 * This checks if the user is permitted to access resources that require lifetime access or trialing subsciption
 * see isStripeSubscriptionInvalid
 */
// export const subscriptionCheck: RequestHandler = async (req, res, next) => {
//   try {
//     const { email } = req.decodedFirebaseToken;

//     // this middleware is only used for routes where the user is logged in
//     // do we need to 1) check if user exists, 2) throw error if user === null
//     // TODO: fix the subscription check
//     const { stripeLifetimeAccessPaymentId, stripeCurrentPeriodEnd, stripeStatus, openaiApiKey } = (await User.findOne({
//       email,
//     })) as DUser;

//     /** lifetime access checks */
//     if (stripeLifetimeAccessPaymentId !== '') {
//       req.hasLifetimeAccess = true;
//     }

//     if (isStripeSubscriptionInvalid(stripeCurrentPeriodEnd, stripeStatus)) {
//       next(new ApiError(httpStatus.FORBIDDEN, 'Your subscription has expired'));
//     }

//     req.hasLifetimeAccess = stripeStatus === 'active' || stripeStatus === 'canceled' || openaiApiKey !== '';
//     next();
//   } catch (error: any) {
//     next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to retrieve your account'));
//   }
// };

export function isSimplifyTrialValid(trialEnd: number) {
  if (getCurrentUnixSeconds() < trialEnd) {
    return true;
  }

  return false;
}

/** Checks if the current subscription is invalid. Canceled subscriptions are good until current date > current period end */
export function isStripeSubscriptionInvalid(
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

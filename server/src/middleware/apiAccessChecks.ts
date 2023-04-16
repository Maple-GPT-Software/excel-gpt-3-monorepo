import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import Stripe from 'stripe';

import ApiError from '../utils/ApiError';

export const freeTrialCheck: RequestHandler = async (req, res, next) => {
  const {
    user: { stripeLifetimeAccessPaymentId, simplifyTrialEnd },
  } = req;

  // FUTURE: if user has openaiApiKey we can skip to next middleware
  // user has paid for lifetime access
  if (stripeLifetimeAccessPaymentId !== '') {
    next();
    return;
  }

  if (!isSimplifyTrialValid(simplifyTrialEnd)) {
    next(new ApiError(httpStatus.FORBIDDEN, 'Your free trial has expired'));
    return;
  }

  next();
};

export const hasSufficientCredits: RequestHandler = async (req, res, next) => {
  const {
    user: { stripeLifetimeAccessPaymentId, credits },
  } = req;

  // FUTURE: if user has openaiApiKey we can skip to next middleware
  // free trial user
  if (stripeLifetimeAccessPaymentId === '') {
    next();
    return;
  }

  if (credits === undefined || credits === 0) {
    next(new ApiError(httpStatus.FORBIDDEN, 'You have insufficient credits.'));
    return;
  }

  next();
};

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

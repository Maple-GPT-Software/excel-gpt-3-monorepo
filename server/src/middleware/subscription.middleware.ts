import { RequestHandler } from 'express';
import httpStatus from 'http-status';
import Stripe from 'stripe';

import ApiError from '../utils/ApiError';

export const addSubscriptionTypeToReq: RequestHandler = async (req, res, next) => {
  const {
    user: { stripeStatus, stripeCurrentPeriodEnd },
  } = req;

  if (stripeStatus === undefined || stripeCurrentPeriodEnd === undefined) {
    next(new ApiError(httpStatus.FORBIDDEN, 'You do not have an active trial or subscription.'));
    return;
  }

  if (stripeStatus === 'active' || (stripeStatus === 'canceled' && stripeCurrentPeriodEnd - getCurrentUnixSeconds() < 0)) {
    req.hasPaidSubscription = true;
  } else {
    req.hasPaidSubscription = false;
  }

  next();
};

export const subscriptionCheck: RequestHandler = async (req, res, next) => {
  const {
    user: { stripeCurrentPeriodEnd, stripeStatus },
  } = req;

  if (stripeStatus === undefined || stripeCurrentPeriodEnd === undefined) {
    next(new ApiError(httpStatus.FORBIDDEN, 'You do not have an active trial or subscription.'));
    return;
  }

  if (isStripeSubscriptionInvalid(stripeCurrentPeriodEnd, stripeStatus)) {
    next(new ApiError(httpStatus.FORBIDDEN, 'Your subscription has ended.'));
    return;
  }

  next();
};

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
   * - Stripe's current period end is a Unix timestamp (seconds since epoch), so it has no timezone information
   *   the calculation above is valid regardless of the timezone the server is in
   * - subscription can be cancelled but we permit access to APIs until current date > currentPeriodEnd
   */
  const hasCurrentPeriodExpired = stripeCurrentPeriodEnd - getCurrentUnixSeconds() < 0;

  if (hasCurrentPeriodExpired || stripeStatus === 'past_due') {
    return true;
  } else if (stripeStatus === 'trialing' || stripeStatus === 'active' || stripeStatus === 'canceled') {
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

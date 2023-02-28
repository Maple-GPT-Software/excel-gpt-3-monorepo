import { RequestHandler } from 'express';
import httpStatus from 'http-status';

import ApiError from '@src/utils/ApiError';
import admin from '@src/services/firebase.service';
import { User, UserType } from '@src/models/user.model';

/**
 * This checks if the user has an active trial or paid subscription. If they do
 * we grant them access to our service to make completion requests.
 */
const subscriptionCheck: RequestHandler = async (req, res, next) => {
  try {
    const email = req.decodedFirebaseToken.email;

    // this middleware is only use for routes where the user is logged in
    // do we need to 1) check if user exists, 2) throw error if user === null
    const user = (await User.findOne({ email })) as UserType;

    if (isStripeSubscriptionInvalid(user)) {
      next(new ApiError(httpStatus.FORBIDDEN, 'Your subscription as expired'));
    }

    next();
  } catch (error: any) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to retrieve your account'));
  }
};

export default subscriptionCheck;

/**
 * Checks if the user has a subscription status of `trialing`
 */
function isStripeSubscriptionInvalid(user: UserType) {
  const { stripeCurrentPeriodEnd, stripeStatus } = user;

  const hasCurrentPeriodExpired = stripeCurrentPeriodEnd ? Math.floor(Date.now() / 1000) - stripeCurrentPeriodEnd > 0 : true;

  if (!stripeCurrentPeriodEnd || !stripeStatus) {
    return true;
  } else if (hasCurrentPeriodExpired) {
    return true;
  } else if (stripeStatus === 'trialing' || stripeStatus === 'active') {
    return false;
  } else if (stripeStatus === 'canceled' && Math.floor(Date.now() / 1000) - stripeCurrentPeriodEnd < 0) {
    // canceled but current date is before stripeCurrentPeriodEnd
    return false;
  } else {
    return true;
  }
}

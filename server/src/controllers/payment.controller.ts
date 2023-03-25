import { Request, Response } from 'express';
import httpStatus from 'http-status';

import {
  cancelSubscriptionById,
  createCustomerWithFreeTrial,
  createPaymentSession,
  createSubscriptionSession,
} from '../services/stripe.service';
import { encryptData } from '../services/encryption.service';
import catchAsync from '../utils/catchAsync';
import { User } from '../models/user.model';
import ApiError from '../utils/ApiError';
import settings from '../settings';

/** users are signed up with a trial account by default */
export const createTrial = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.decodedFirebaseToken;
  const user = await User.findOne({ email });

  /**
   * customer ids only get added to the user's profile if they
   *  1) signed up to trial
   *  2) completed checkout for a paid subscription
   */
  if (user?.stripeCustomerId) {
    res.status(httpStatus.FORBIDDEN).send('You already trialed our services');
  }

  await createCustomerWithFreeTrial(email);

  // send OK so client knows to move user along in signup flow
  res.status(httpStatus.OK).send();
});

export const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const { id: subscriptionId } = req.params;
  const { email } = req.decodedFirebaseToken;
  await cancelSubscriptionById(email, subscriptionId);
  res.status(httpStatus.OK).send();
});

export const createCheckoutSession = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.decodedFirebaseToken;
  const { priceId, successUrl, cancelUrl } = req.body;

  const user = await User.findOne({ email });

  if (!user?.stripeCustomerId) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }

  const session = await createSubscriptionSession(user.stripeCustomerId, { successUrl, cancelUrl, priceId });

  res.status(httpStatus.TEMPORARY_REDIRECT).send(session);
});

export const createLifetimeAccessPurchaseSession = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.decodedFirebaseToken;
  const { successUrl, cancelUrl, openaiApiKey } = req.body;

  const user = await User.findOne({ email });

  if (user?.openaiApiKey !== '' && user?.stripeLifetimeAccessPaymentId !== '') {
    throw new ApiError(httpStatus.FORBIDDEN, 'An open ai API key already exists on your account');
  } else if (!user?.stripeCustomerId) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
  }

  await User.updateOne({ email }, { openaiApiKey: encryptData(openaiApiKey) }).catch((e) => {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Interval server error');
  });

  const session = await createPaymentSession(user.stripeCustomerId, {
    priceId: settings.stripePriceIds.lifetimeChatAccess,
    successUrl,
    cancelUrl,
  });

  res.status(httpStatus.TEMPORARY_REDIRECT).send(session);
});

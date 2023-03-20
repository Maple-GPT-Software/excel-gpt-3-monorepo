import { Request, Response } from 'express';
import catchAsync from '@src/utils/catchAsync';
import { cancelSubscriptionById, createCustomerWithFreeTrial, createSessionByPricetId } from '@src/services/stripe.service';
import httpStatus from 'http-status';
import { User, UserType } from '@src/models/user.model';
import { PRICE_IDS } from '@src/constants';
import ApiError from '@src/utils/ApiError';

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

export const createPurchaseSession = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.decodedFirebaseToken;
  const { priceId, successUrl, cancelUrl } = req.body;

  const session = await createSessionByPricetId(email, priceId, { successUrl, cancelUrl });

  res.status(httpStatus.TEMPORARY_REDIRECT).send(session);
});

export const createLifetimeAccessPurchaseSession = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.decodedFirebaseToken;
  const { successUrl, cancelUrl, openAiApiKey } = req.body;

  User.updateOne({ email }, { openAiApiKey }).catch((e) => {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Interval server error');
  });

  const session = await createSessionByPricetId(email, PRICE_IDS.LIFETIME_CHAT_ACCESS, { successUrl, cancelUrl });

  return session;
});

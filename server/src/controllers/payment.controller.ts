import { Request, Response } from 'express';
import catchAsync from '@src/utils/catchAsync';
import { cancelSubscriptionById, createCustomerWithFreeTrial, createSessionByProductId } from '@src/services/stripe.service';
import httpStatus from 'http-status';
import { User } from '@src/models/user.model';

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

  const session = await createSessionByProductId(email, priceId, { successUrl, cancelUrl });

  res.status(httpStatus.TEMPORARY_REDIRECT).send(session);
});

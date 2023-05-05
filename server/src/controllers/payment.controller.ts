import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { cancelSubscriptionById, createCustomerWithFreeTrial, createSubscriptionSession } from '../services/stripe.service';
import catchAsync from '../utils/catchAsync';
import { User } from '../models/user.model';

/** users are signed up with a trial account by default */
export const createTrial = catchAsync(async (req: Request, res: Response) => {
  const { email } = req.decodedFirebaseToken;
  const user = await User.findOne({ email });

  /**
   * customer ids only get added to the user's profile if they
   *  1) signed up to trial
   *  2) completed checkout for a paid subscription
   */
  if (user?.stripeCurrentPeriodEnd) {
    res.status(httpStatus.FORBIDDEN).send('You already trialed our services');
    return;
  }

  if (user?.stripeCustomerId === undefined) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('#createTrial > Internal server error');
    return;
  }

  await createCustomerWithFreeTrial(user?.stripeCustomerId as string);

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

  if (user?.stripeCustomerId === undefined) {
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send('#createTrial > Internal server error');
  }

  const session = await createSubscriptionSession(user?.stripeCustomerId as string, { successUrl, cancelUrl, priceId });

  res.status(httpStatus.TEMPORARY_REDIRECT).send(session);
});

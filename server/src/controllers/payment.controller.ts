import { Request, Response } from 'express';
import catchAsync from '@src/utils/catchAsync';
import { cancelSubscriptionById, createCustomerWithFreeTrial, createSessionByProductId } from '@src/services/stripe.service';
import httpStatus from 'http-status';

export const createTrial = catchAsync(async (req: Request, res: Response) => {
  await createCustomerWithFreeTrial(req.decodedFirebaseToken.email);

  // we dont need to send back the customerId, subscription properties etc...
  // the client apps can use Stripe's client SDK and retrieve information needed
  res.status(httpStatus.OK).send();
});

export const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const { id: subscriptionId } = req.params;
  const email = req.decodedFirebaseToken.email;
  await cancelSubscriptionById(email, subscriptionId);
  res.status(httpStatus.OK).send();
});

export const createSubscriptionSession = catchAsync(async (req: Request, res: Response) => {
  const email = req.decodedFirebaseToken.email;
  const { priceId } = req.body;

  const session = await createSessionByProductId(email, priceId);

  res.status(httpStatus.TEMPORARY_REDIRECT).send(session);
});

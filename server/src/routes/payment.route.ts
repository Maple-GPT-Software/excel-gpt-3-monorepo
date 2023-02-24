import express, { Request, Response } from 'express';
import catchAsync from '@src/utils/catchAsync';
import { cancelSubscriptionById, createCustomerWithFreeTrial } from '../services/stripe.service';
import httpStatus from 'http-status';

const router = express.Router();

const createTrial = catchAsync(async (req: Request, res: Response) => {
  await createCustomerWithFreeTrial(req.decodedFirebaseToken.email);

  // we dont need to send back the customerId, subscription properties etc...
  // the client apps can use Stripe's client SDK and retrieve information needed
  res.status(httpStatus.OK).send();
});

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
  const { id: subscriptionId } = req.params;
  const email = req.decodedFirebaseToken.email;
  await cancelSubscriptionById(email, subscriptionId);
  res.status(httpStatus.OK).send();
});

router.post('/trial', createTrial);

router.post('/cancel-subscription/:id', cancelSubscription);

export default router;

import express, { Request, Response } from 'express';
import catchAsync from '@src/utils/catchAsync';
import { createCustomerWithFreeTrial } from '../services/stripe.service';
import httpStatus from 'http-status';

const router = express.Router();

const createTrial = catchAsync(async (req: Request, res: Response) => {
  await createCustomerWithFreeTrial(req.decodedFirebaseToken.email);

  // we dont need to send back the customerId, subscription properties etc...
  // because the client apps can use Stripe's client SDK and retrieve this information
  // using the user's email. This is the suggested approach
  res.status(httpStatus.OK);
});

router.post('/trial', createTrial);

export default router;

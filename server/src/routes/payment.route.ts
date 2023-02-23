import express, { Request, Response } from 'express';
import catchAsync from '@src/utils/catchAsync';
import { createCustomerWithFreeTrial } from '../services/stripe.service';
import httpStatus from 'http-status';

const router = express.Router();

const createTrial = catchAsync(async (req: Request, res: Response) => {
  const subscription = await createCustomerWithFreeTrial(req.decodedFirebaseToken.email);

  res.status(httpStatus.OK).send({ subscription: subscription });
});

router.post('/', createTrial);

export default router;

import express from 'express';

import { validateCheckoutSession, validateLifetimeAccessSession } from '../validations/payment.validation';
import * as paymentController from '../controllers/payment.controller';
import validate from '../middleware/validate';

const router = express.Router();

router.post('/trial', paymentController.createTrial);

router.put('/cancel-subscription/:id', paymentController.cancelSubscription);

router.post('/checkout-session', validate(validateCheckoutSession), paymentController.createCheckoutSession);

router.post(
  '/lifetime-checkout',
  validate(validateLifetimeAccessSession),
  paymentController.createLifetimeAccessPurchaseSession
);

export default router;

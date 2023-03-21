import express from 'express';
import * as paymentController from '@src/controllers/payment.controller';
import validate from '@src/middleware/validate';
import { validateCheckoutSession, validateLifetimeAccessSession } from '@src/validations/payment.validation';

const router = express.Router();

router.post('/trial', paymentController.createTrial);

router.put('/cancel-subscription/:id', paymentController.cancelSubscription);

router.post('/checkout-session', validate(validateCheckoutSession), paymentController.createPurchaseSession);

router.post(
  '/lifetime-checkout',
  validate(validateLifetimeAccessSession),
  paymentController.createLifetimeAccessPurchaseSession
);

export default router;

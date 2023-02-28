import express from 'express';
import * as paymentController from '@src/controllers/payment.controller';
import validate from '@src/middleware/validate';
import { validatePriceId } from '@src/validations/payment.validation';

const router = express.Router();

router.post('/trial', paymentController.createTrial);

router.put('/cancel-subscription/:id', paymentController.cancelSubscription);

router.post('/subscription-session', validate(validatePriceId), paymentController.createSubscriptionSession);

export default router;

import express from 'express';

import { validateCheckoutSession } from '../validations/payment.validation';
import * as paymentController from '../controllers/payment.controller';
import validate from '../middleware/validate';

const router = express.Router();

router.post('/trial', paymentController.createTrial);

router.put('/cancel-subscription/:id', paymentController.cancelSubscription);

router.post('/checkout-session', validate(validateCheckoutSession), paymentController.createCheckoutSession);

export default router;

import express from 'express';
import * as paymentController from '@src/controllers/payment.controller';

const router = express.Router();

router.post('/trial', paymentController.createTrial);

router.post('/cancel-subscription/:id', paymentController.cancelSubscription);

export default router;

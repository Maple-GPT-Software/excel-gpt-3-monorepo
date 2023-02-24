import express from 'express';

import * as messageController from '@src/controllers/message.controller';

const router = express.Router();

// TODO: middleware to check if the user has an active subscription w Stripe

router.post('/', messageController.createMessage);

// model validate if payload is valid, e.g "LIKE" or "DISLIKE"
router.patch('/rate/:id', messageController.rateMessage);

export default router;

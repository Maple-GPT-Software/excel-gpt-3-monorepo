import express from 'express';

import * as messageController from '@src/controllers/message.controller';
import subscriptionCheck from '@src/middleware/subscriptionCheck';

const router = express.Router();

router.use(subscriptionCheck);

// TODO: validate if body has message
router.post('/', messageController.createMessage);

// TODO: validate if payload is valid, e.g "LIKE" or "DISLIKE"
router.patch('/rate/:id', messageController.rateMessage);

export default router;

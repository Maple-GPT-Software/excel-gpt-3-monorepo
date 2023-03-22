import express from 'express';

import * as messageController from '../controllers/message.controller';
import { lifetimeAccessCheck } from '../middleware/subscriptionCheck';
import validate from '../middleware/validate';
import * as messageValidation from '../validations/message.validation';
import * as rateLimitMiddleware from '../middleware/rateLimit';

const router = express.Router();

router.use(lifetimeAccessCheck);

router.post(
  '/',
  rateLimitMiddleware.dailyMessagesLimiter,
  validate(messageValidation.createMessage),
  messageController.createMessage
);

router.patch('/rate/:id', validate(messageValidation.rateMessage), messageController.rateMessage);

export default router;

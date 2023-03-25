import express from 'express';

import * as messageController from '../controllers/message.controller';
import * as messageValidation from '../validations/message.validation';
import { lifetimeAccessCheck } from '../middleware/subscriptionCheck';
import * as rateLimitMiddleware from '../middleware/rateLimit';
import validate from '../middleware/validate';

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

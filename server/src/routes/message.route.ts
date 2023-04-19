import express from 'express';

import { addConversationToRequest } from '../middleware/conversation.middleware';
import * as subscriptionMiddleware from '../middleware/subscription.middleware';
import * as messageController from '../controllers/message.controller';
import * as messageValidation from '../validations/message.validation';
import { addUserToRequest } from '../middleware/addUserToRequest';
import * as rateLimitMiddleware from '../middleware/rateLimit';
import validate from '../middleware/validate';

const router = express.Router();

router.use(addUserToRequest);

router.post(
  '/',
  validate(messageValidation.createMessage),
  rateLimitMiddleware.dailyMessagesLimiter,
  subscriptionMiddleware.addSubscriptionTypeToReq,
  subscriptionMiddleware.subscriptionCheck,
  addConversationToRequest,
  messageController.createMessage
);

router.patch('/rate/:id', validate(messageValidation.rateMessage), messageController.rateMessage);

export default router;

import express from 'express';

import * as conversationController from '../controllers/conversation.controller';
import * as conversationValidation from '../validations/conversation.validation';
import * as subscriptionMiddleware from '../middleware/subscription.middleware';
import { canAccessConversation } from '../middleware/conversation.middleware';
import { addUserToRequest } from '../middleware/addUserToRequest';
import validate from '../middleware/validate';

const router = express.Router();

router.use(addUserToRequest);

router.get('/', conversationController.getConversation);

router.get('/messages/:id', conversationController.getConversationMessages);

router.post(
  '/',
  subscriptionMiddleware.subscriptionCheck,
  validate(conversationValidation.newConversation),
  conversationController.createConversation
);

router.delete('/:id', canAccessConversation, conversationController.deleteConversation);

router.patch(
  '/:id',
  canAccessConversation,
  validate(conversationValidation.editConversation),
  conversationController.updateConversation
);

export default router;

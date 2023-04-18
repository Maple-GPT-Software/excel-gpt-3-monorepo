import express from 'express';

import * as conversationController from '../controllers/conversation.controller';
import * as conversationValidation from '../validations/conversation.validation';
import { canAccessConversation } from '../middleware/conversation.middleware';
import validate from '../middleware/validate';

const router = express.Router();

router.post('/', validate(conversationValidation.newConversation), conversationController.createConversation);

router.delete('/:id', canAccessConversation, conversationController.deleteConversation);

router.patch(
  '/:id',
  canAccessConversation,
  validate(conversationValidation.editConversation),
  conversationController.updateConversation
);

export default router;

import express from 'express';

import * as conversationController from '../controllers/conversation.controller';
import * as conversationValidation from '../validations/conversation.validation';
import validate from '../middleware/validate';

const router = express.Router();

router.post('/', validate(conversationValidation.newConversation), conversationController.createConversation);

// // TODO: validate request body and params
// // TODO: check conversation access
// router.delete('/:id', conversationController.deleteConversation);

// // TODO: check conversation access
// router.patch('/edit/:id', conversationController.updateConversation);

export default router;

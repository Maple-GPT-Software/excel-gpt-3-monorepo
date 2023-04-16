import express from 'express';

import { freeTrialCheck, hasSufficientCredits } from '../middleware/apiAccessChecks';
import * as messageController from '../controllers/message.controller';
import * as messageValidation from '../validations/message.validation';
import { addUserToRequest } from '../middleware/addUserToRequest';
import * as rateLimitMiddleware from '../middleware/rateLimit';
import validate from '../middleware/validate';

const router = express.Router();

router.use(addUserToRequest, freeTrialCheck, hasSufficientCredits);

router.post(
  '/',
  rateLimitMiddleware.dailyMessagesLimiter,
  validate(messageValidation.createMessage),
  messageController.createMessage
);

router.patch('/rate/:id', validate(messageValidation.rateMessage), messageController.rateMessage);

export default router;

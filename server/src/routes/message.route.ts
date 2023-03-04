import express from 'express';

import * as messageController from '@src/controllers/message.controller';
import subscriptionCheck from '@src/middleware/subscriptionCheck';
import validate from '@src/middleware/validate';
import * as messageValidation from '@src/validations/message.validation';

const router = express.Router();

router.use(subscriptionCheck);

// TODO: rate limiting and backoff middlewares
router.post('/', validate(messageValidation.createMessage), messageController.createMessage);

router.patch('/rate/:id', validate(messageValidation.rateMessage), messageController.rateMessage);

export default router;

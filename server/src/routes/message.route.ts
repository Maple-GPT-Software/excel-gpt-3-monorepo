import express from 'express';

import * as messageController from '@src/controllers/message.controller';
import subscriptionCheck from '@src/middleware/subscriptionCheck';
import validate from '@src/middleware/validate';
import * as messageValidation from '@src/validations/message.validation';
import maxDailyRequest from '@src/middleware/maxDailyRequests';

const router = express.Router();

router.use(subscriptionCheck);

router.post('/', maxDailyRequest, validate(messageValidation.createMessage), messageController.createMessage);

router.patch('/rate/:id', validate(messageValidation.rateMessage), messageController.rateMessage);

export default router;

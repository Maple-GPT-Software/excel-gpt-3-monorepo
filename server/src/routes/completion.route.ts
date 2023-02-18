import express from 'express';

import * as completionController from '@src/controllers/completion.controller';

const router = express.Router();

router.post('/', completionController.createCompletion);

// router.patch('/completion/rate/:id');

// router.post('/signup', validate(authValidation.firebaseSignup), authController.signup);

// router.post('/login', authController.login);

export default router;

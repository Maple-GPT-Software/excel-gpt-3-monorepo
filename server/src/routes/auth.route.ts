import express from 'express';
import validate from '@src/middleware/validate';

import * as authValidation from '@src/validations/auth.validation';
import * as authController from '@src/controllers/auth.controller';

const router = express.Router();

// TODO: on sign up we create a stripe subscription for a free 5 day trial
// TODO: email to be sent out after the user signs up???
router.post('/signup', validate(authValidation.firebaseSignup), authController.signup);

router.post('/login', authController.login);

export default router;

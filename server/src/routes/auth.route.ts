import express from 'express';
import validate from '@src/middleware/validate';

import * as authValidation from '@src/validations/auth.validation';
import * as authController from '@src/controllers/auth.controller';

const router = express.Router();

router.post('/signup', validate(authValidation.firebaseSignup), authController.signup);

router.post('/login', authController.login);

export default router;

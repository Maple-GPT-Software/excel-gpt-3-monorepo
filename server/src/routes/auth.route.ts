import express from 'express';
import validate from '../middleware/validate';

import * as authValidation from '../validations/auth.validation';
import * as authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', validate(authValidation.firebaseSignup), authController.signup);

router.post('/login', authController.login);

export default router;

import express from 'express';
import validate from '@src/middleware/validate';

import * as authValidation from '@src/validations/auth.validation';
import * as authController from '@src/controllers/auth.controller';
import firebaseAuth from '@src/middleware/firebaseAuth';
import { RequestHandlerWithAuth } from '@src/types';

const router = express.Router();

router.post<RequestHandlerWithAuth>(
  '/signup',
  firebaseAuth as any,
  validate(authValidation.register) as any,
  authController.signup as any
);
router.post('/login', authController.login as any);

export default router;

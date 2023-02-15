import express, { NextFunction } from 'express';
import validate from '@src/middleware/validate';

import * as authValidation from '@src/validations/auth.validation';
import * as authController from '@src/controllers/auth.controller';
// import firebaseAuth from '@src/middleware/firebaseAuth';
import { RequestHandlerWithAuth } from '@src/types';
import admin from '@src/services/firebase.service';
import ApiError from '@src/utils/ApiError';
import httpStatus from 'http-status';
import logger from '@src/config/logger';

const router = express.Router();

router.post(
  '/signup',
  async (req: any, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
      }

      const idToken = authHeader.split(' ')[1];

      const decodedToken = await admin.auth().verifyIdToken(idToken);
      logger.info(`decodedToken ${decodedToken}`);
      res.json(decodedToken);
      if (!decodedToken) {
        return new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
      }
    } catch (error) {
      logger.warn('not authorized');
      res.json('Not authorized');
    }
  },
  validate(authValidation.register) as any,
  authController.signup as any
);

router.post('/login', authController.login as any);

export default router;

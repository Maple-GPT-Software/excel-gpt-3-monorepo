import logger from '@src/config/logger';
import { RequestHandler, NextFunction } from 'express';
import httpStatus from 'http-status';
// import ApiError from "../utils/ApiError";
import verifyIdToken from '@src/services/firebase.service';
import ApiError from '@src/utils/ApiError';
import admin from '@src/services/firebase.service';

const firebaseAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(new ApiError(httpStatus.FORBIDDEN, 'Please login'));
      return;
    }

    const idToken = authHeader.split(' ')[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.decodedFirebaseToken = decodedToken;

    res.json(decodedToken);

    next();
  } catch (error: any) {
    next(new ApiError(httpStatus.FORBIDDEN, error.message));
  }
};

export default firebaseAuth;

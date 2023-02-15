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
      return new ApiError(httpStatus.FORBIDDEN, 'You are not authorized');
    }

    const idToken = authHeader.split(' ')[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    logger.info(`decodedToken ${JSON.stringify(decodedToken)}`);

    if (!decodedToken) {
      return new ApiError(httpStatus.FORBIDDEN, 'Unauthorized');
    }

    // TODO: how to type this thing to add decodedToken as
    // a property of req???
    res.json(decodedToken);

    next();
  } catch (error) {
    logger.warn('not authorized');
    res.json('Not authorized');
  }
};

export default firebaseAuth;

import { RequestHandler } from 'express';
import httpStatus from 'http-status';
// import ApiError from "../utils/ApiError";
import verifyIdToken from '@src/services/firebase.service';
import { RequestHandlerWithAuth } from '../types';

const getAuthTokenFromHeaders: RequestHandlerWithAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    // eslint-disable-next-line prefer-destructuring
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }
  next();
};

/**
 * verify accessToken and attaches userId to req
 */
const firebaseAuth = (): RequestHandlerWithAuth => async (req, res, next) => {
  getAuthTokenFromHeaders(req, res, async () => {
    try {
      const { authToken } = req;

      if (!authToken) {
        return new Error('you are not authorized');
        // return new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to make this request');
      }

      const userInfo = await verifyIdToken(authToken);
      req.userId = userInfo.uid;
      return next();
    } catch (e) {
      next(e);
    }
  });
};

export default firebaseAuth;

import { NextFunction, Response } from "express";

const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
import auth from '../services/firebase.service';

import { AuthenticatedRequest } from "../type";

const getAuthTokenFromHeaders = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(' ')[0] === 'Bearer'
  ) {
    req.authToken = req.headers.authorization.split(' ')[1];
  } else {
    req.authToken = null;
  }
  next();
};

/**
 * verify accessToken and attaches userId to req
 */
const firebaseAuth = () => async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  getAuthTokenFromHeaders(req, res, async () => {
    try {
      const { authToken } = req;

      if(!authToken) {
        return new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to make this request')
      }

      const userInfo = await auth.verifyIdToken(authToken);
      req.userId = userInfo.uid;
      return next();
    } catch (e) {
      next(e)
    }
  });
};

module.exports = firebaseAuth;

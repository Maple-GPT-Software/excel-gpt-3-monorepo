import { RequestHandler } from 'express';
import httpStatus from 'http-status';

import { DUserObject, User } from '../models/user.model';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';

export const addUserToRequest: RequestHandler = async (req, res, next) => {
  try {
    const { uid } = req.decodedFirebaseToken;

    const user = (await User.findById(uid))?.toObject();

    if (user === undefined) {
      next(new ApiError(httpStatus.NOT_FOUND, 'User not found'));
      return;
    }

    req.user = user as DUserObject;

    next();
  } catch (error) {
    logger.error('#addUserToRequest erorr', error);
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to retrieve your account'));
  }
};

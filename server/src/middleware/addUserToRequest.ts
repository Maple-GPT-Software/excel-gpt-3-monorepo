import { RequestHandler } from 'express';
import httpStatus from 'http-status';

import { User } from '../models/user.model';
import ApiError from '../utils/ApiError';

export const addUserToRequest: RequestHandler = async (req, res, next) => {
  try {
    const { uid } = req.decodedFirebaseToken;

    const user = (await User.findById(uid))?.toObject();

    if (!user) {
      next(new ApiError(httpStatus.NOT_FOUND, 'User not found'));
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to retrieve your account'));
  }
};

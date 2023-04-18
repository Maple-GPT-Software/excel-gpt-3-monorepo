import httpStatus from 'http-status';

import { User } from '../models/user.model';
import ApiError from '../utils/ApiError';
import { DUser } from '../types';

export const createUser = async (newUser: DUser) => {
  if (await User.isEmailTaken(newUser.email)) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
  }
  const newUserDoc = new User(newUser);

  return newUserDoc.save();
};

export const getUserById = async (userId: string) => {
  const user = await User.findById(userId);

  if (user === null) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  return user;
};

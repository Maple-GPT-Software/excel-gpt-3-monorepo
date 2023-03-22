import httpStatus from 'http-status';
import { User, UserType } from '../models/user.model';
import ApiError from '../utils/ApiError';

export const createUser = async (newUser: UserType) => {
  if (await User.isEmailTaken(newUser.email)) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
  }
  return User.create(newUser);
};

export const getUserById = async (userId: string) => {
  return User.findOne({ userId });
};

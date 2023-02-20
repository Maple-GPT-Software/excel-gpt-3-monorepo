import httpStatus from 'http-status';
import { User, UserType } from '@src/models/user.model';
import ApiError from '@src/utils/ApiError';

export const createUser = async (newUser: UserType) => {
  if (await User.isEmailTaken(newUser.email)) {
    throw new ApiError(httpStatus.CONFLICT, 'Email already taken');
  }
  return await User.create(newUser);
};

export const getUserById = async (userId: string) => {
  return await User.findOne({ userId });
};

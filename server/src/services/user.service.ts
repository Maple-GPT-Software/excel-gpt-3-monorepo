import httpStatus from 'http-status';
import { User } from '@src/models/user.model';
import ApiError from '@src/utils/ApiError';

interface CreateUserType {
  userId: string;
  email: string;
  name: string;
  signupSource: string;
  referrer: string;
}

export const createUser = async (newUser: CreateUserType) => {
  if (await User.isEmailTaken(newUser.email)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(newUser);
};

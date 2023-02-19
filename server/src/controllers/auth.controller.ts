import { Response, Request } from 'express';

import httpStatus from 'http-status';
import catchAsync from '@src/utils/catchAsync';
import * as userService from '@src/services/user.service';
import ApiError from '@src/utils/ApiError';

// TODO: CRON job to schedule email to be sent after sign-up
export const signup = catchAsync(async (req: Request, res: Response) => {
  const newUser = {
    userId: req.decodedFirebaseToken.uid,
    email: req.decodedFirebaseToken.email,
    name: req.decodedFirebaseToken.name,
    signUpSource: req.body.signUpSource,
    referrer: req.body.referrer ?? '',
  };
  const user = await userService.createUser(newUser);
  res.status(httpStatus.CREATED).send({ user: user });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.decodedFirebaseToken.uid);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

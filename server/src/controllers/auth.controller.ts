import { Response, Request } from 'express';

import httpStatus from 'http-status';
import catchAsync from '@src/utils/catchAsync';
import * as userService from '@src/services/user.service';

export const signup = catchAsync(async (req: Request, res: Response) => {
  const newUser = {
    userId: req.decodedFirebaseToken.uid,
    email: req.decodedFirebaseToken.email,
    name: req.decodedFirebaseToken.name,
    signupSource: req.body.signUpSource,
    referrer: req.body.referrer ?? null,
  };
  const user = await userService.createUser(newUser);
  res.status(httpStatus.CREATED).send({ user: user });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  // TODO: get profile from db and send back to client
  // const { email, password } = req.body;
  console.log('logged in');
  res.send({ user: 'test user' });
});

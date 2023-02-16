import { Response, Request } from 'express';

import httpStatus from 'http-status';
import catchAsync from '@src/utils/catchAsync';

export const signup = catchAsync(async (req: Request, res: Response) => {
  // TODO: create user profile
  console.log('signed up');
  //   const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ user: 'testuser' });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  // TODO: get profile from db and send back to client
  // const { email, password } = req.body;
  console.log('logged in');
  res.send({ user: 'test user' });
});

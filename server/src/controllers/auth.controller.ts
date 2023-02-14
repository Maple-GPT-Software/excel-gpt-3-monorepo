import { Response } from 'express';
import { AuthenticatedRequest } from '@src/types';

import httpStatus from "http-status";
import catchAsync from "@src/utils/catchAsync";

export const signup = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // TODO: create user profile
  console.log('signed up');
  //   const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send({ user: 'testuser' });
});

export const login = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
  // TODO: get profile from db and send back to client
  // const { email, password } = req.body;
  console.log('logged in');
  res.send({ user: 'test user' });
});

import { Response, Request } from 'express';

import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import * as userService from '../services/user.service';
import ApiError from '../utils/ApiError';
import { TERMS_AND_CONDITION_VERSION } from '../constants';
import { endOfDay } from '../utils/dateUtils';

export const signup = catchAsync(async (req: Request, res: Response) => {
  const { uid: userId, email } = req.decodedFirebaseToken;

  const newUser = {
    userId,
    email,
    name: req.body.name,
    signUpSource: req.body.signUpSource,
    hasAcceptedTerms: req.body.hasAcceptedTerms,
    acceptedTermsVersion: TERMS_AND_CONDITION_VERSION,
    referrer: req.body.referrer ?? '',
    // 5 day free subscription
    simplifyTrialEnd: endOfDay(5),
  };
  const user = await userService.createUser(newUser);
  res.status(httpStatus.CREATED).send({ user });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.decodedFirebaseToken.uid);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  res.send(user);
});

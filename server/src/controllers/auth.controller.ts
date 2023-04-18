import { Response, Request } from 'express';

import httpStatus from 'http-status';

import mongoose from 'mongoose';

import { TERMS_AND_CONDITION_VERSION } from '../constants';
import * as userService from '../services/user.service';
import catchAsync from '../utils/catchAsync';

/**
 * creates basic user profile when the user authenticates with firebase
 * Stripe property values are added by webhook event handlers
 * */
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
    _id: new mongoose.Types.ObjectId(userId),
  };

  const user = await userService.createUser(newUser);

  res.status(httpStatus.CREATED).send({ user });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getUserById(req.decodedFirebaseToken.uid);
  res.status(200).send(user);
});

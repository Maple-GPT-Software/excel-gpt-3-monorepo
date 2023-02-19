import { RequestHandler } from 'express';
import httpStatus from 'http-status';

import ApiError from '@src/utils/ApiError';
import admin from '@src/services/firebase.service';

/**
 * This middlewares validates the accessToken sent by the client applications
 * via firebase admin SDK. The decoded token includes the following properties
 *  - uid: the user's id
 *  - email
 *  - display name
 * we add the entire decoded token to the req so that other middlewares have acess
 * to these properties
 */
const firebaseAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      next(new ApiError(httpStatus.FORBIDDEN, 'Please login'));
      return;
    }

    const idToken = authHeader.split(' ')[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.decodedFirebaseToken = decodedToken;

    next();
  } catch (error: any) {
    next(new ApiError(httpStatus.FORBIDDEN, error.message));
  }
};

export default firebaseAuth;

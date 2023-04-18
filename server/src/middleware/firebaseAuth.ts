import { RequestHandler } from 'express';
import httpStatus from 'http-status';

import admin from '../services/firebase.service';
import ApiError from '../utils/ApiError';

import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

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
      next(new ApiError(httpStatus.FORBIDDEN, 'You are not logged in'));
      return;
    }

    const idToken = authHeader.split(' ')[1];

    const decodedToken = await admin.auth().verifyIdToken(idToken);

    req.decodedFirebaseToken = {
      ...decodedToken,
      // FUTURE: cache this calculation
      uid: firebaseUidTo24CharHexString(decodedToken.uid),
    } as Required<DecodedIdToken>;

    next();
  } catch (error: any) {
    next(new ApiError(httpStatus.FORBIDDEN, error.message));
  }
};

export default firebaseAuth;

/** create a 24 character hex string for mongoose's ObjectId constructor */
export function firebaseUidTo24CharHexString(uid: string) {
  return Buffer.from(uid, 'utf-8').subarray(0, 12).toString('hex');
}

import { RequestHandler, NextFunction } from 'express';
import httpStatus from 'http-status';
// import ApiError from "../utils/ApiError";
import verifyIdToken from '@src/services/firebase.service';
import { AuthenticatedRequest, RequestHandlerWithAuth } from '../types';
import ApiError from '@src/utils/ApiError';

// const getAuthTokenFromHeaders: RequestHandlerWithAuth = (req, res, next) => {
//   if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
//     // eslint-disable-next-line prefer-destructuring
//     req.authToken = req.headers.authorization.split(' ')[1];
//   } else {
//     req.authToken = null;
//   }
//   next();
// };

// // TODO: this is broken
// export const firebaseAuth: RequestHandlerWithAuth = (req, res, next) => {
//   getAuthTokenFromHeaders(req, res, async () => {
//     try {
//       const { authToken } = req;

//       if (!authToken) {
//         return new Error('you are not authorized');
//         // return new ApiError(httpStatus.FORBIDDEN, 'You are not authorized to make this request');
//       }

//       const userInfo = await verifyIdToken(authToken);
//       req.userId = userInfo.uid;
//       return next();
//     } catch (e) {
//       next(e);
//     }
//   });
// };

// const firebaseAuth = async (req: RequestHandlerWithAuth, res: Response, next: NextFunction) => {
//     try {
//       const authHeader = req.authorization;

//       if (!authHeader) {
//         return new ApiError(httpStatus.FORBIDDEN, 'You are unathoried');
//       }

//       const idToken = authHeader.split(' ')[1];

//       const decodedToken = await verifyIdToken(idToken);

//       console.warn(decodedToken);
//       // req.userId = decodedToken;

//       return next();
//     } catch (error) {
//       console.error(error);
//       return new ApiError(httpStatus.FORBIDDEN, 'You are unathoried');
//     }
//   };
// };

// export default firebaseAuth;

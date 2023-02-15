import { NextFunction, RequestHandler } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

// firebase authenticated request type
export interface AuthenticatedRequest extends Request {
  headers: {
    authorization?: string;
  };
  decodedFirebaseToken?: DecodedIdToken;
}

type RequestWithAuth<T> = T & AuthenticatedRequest;

export type RequestHandlerWithAuth = RequestHandler<RequestWithAuth<{}>>;

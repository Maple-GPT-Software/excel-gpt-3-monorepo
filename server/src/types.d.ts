import { NextFunction } from 'express';

// Authenticated request type
export interface AuthenticatedRequest extends Request {
  headers: {
    authorization?: string;
  };
  authToken?: string | null;
  tokenTyep?: string | null;
  userId?: string | null;
}

export type RequestHandlerWithAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;

import { NextFunction, RequestHandler } from 'express';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

// ENUM FOR ENVIRONMENT
export enum Environment {
  PROD = 'production',
  DEV = 'development',
  TEST = 'test',
}

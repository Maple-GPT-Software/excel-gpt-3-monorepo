import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

declare namespace Expres {
  export interface Request {
    headers: {
      authorization?: string;
    };
    decodedFirebaseToken?: DecodedIdToken;
  }
}

// https://blog.logrocket.com/extend-express-request-object-typescript/

import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';

export {};

// This allows us to extend the types from Express and do stuff
// like add decodedToken as a property of Request types
// see firebaseAuth for use-case
declare global {
  namespace Express {
    export interface Request {
      /** We only use providers that require email for registration, e.g Google, Facebook */
      decodedFirebaseToken: Required<DecodedIdToken>;
      /** only true when the user has paid for lifetime access */
      hasLifetimeAccess?: boolean;
    }
  }
}

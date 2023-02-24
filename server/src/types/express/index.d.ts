// https://blog.logrocket.com/extend-express-request-object-typescript/

export {};

// This allows us to extend the types from Express and do stuff
// like add decodedToken as a property of Request types
// see firebaseAuth for use-case
declare global {
  namespace Express {
    export interface Request {
      decodedFirebaseToken?: DecodedIdToken;
    }
  }
}

import {FirebaseAuth} from '@firebase/auth-types';

// TODO: this is the user object our REST API will return
// when we send an access to the /profile endpoint
interface User {
  // OAuth accessToken that is valid for 1 hour
  accessToken: string;
  email: string;
  displayName: string;
  // user's id in firebase project but not uuid of user's profile
  uid: string;
  // TODO: other properties for stripe (subscription etc...)
}

// We only care about the access token
interface SignInWithPopupUser {
  accessToken: string;
  email: string;
  displayName: string;
  uid: string;
}

declare global {
  interface Window {
    googleAuthPopUp: () => Promise<SignInWithPopupUser | undefined>;
    // https://firebase.google.com/docs/reference/js/v8/firebase.User#getidtoken
    // Returns the current token if it has not expired. Otherwise, this will refresh the token and return a new one.
    getAuth: () => FirebaseAuth;
  }
}
export interface GPTCompletion {
  choices: { finish_reason: string; index: number; text: string }[];
  id: string;
  model: string;
  object: string;
}

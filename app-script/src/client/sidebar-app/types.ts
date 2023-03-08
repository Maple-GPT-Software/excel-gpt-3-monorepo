import { FirebaseAuth } from '@firebase/auth-types';

interface User {
  // OAuth accessToken that is valid for 1 hour
  accessToken: string;
  email: string;
  displayName: string;
  // user's id in firebase project but not uuid of user's profile
  uid: string;
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

export enum CompletionRating {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

/** the completion we get back from the back-end */
export interface GPTCompletion {
  message: string;
  /** completion's id */
  id: string;
  /**
   * we can optimistically update the rating, if server doesn't answer with
   * 200 we can undo the optimistic update
   */
  rating: CompletionRating | '';
  status: 'success' | 'fail';
}

// Object returns by getSelectedRangeValues
export interface ValueRangeObj {
  range: string;
  values: string;
}

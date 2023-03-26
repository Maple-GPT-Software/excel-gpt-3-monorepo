import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyD-HGaNIlqTjZiRQAA6wvKOBjQVUyFwBQQ',
  authDomain: 'excel-simplify.firebaseapp.com',
  projectId: 'excel-simplify',
  storageBucket: 'excel-simplify.appspot.com',
  messagingSenderId: '357936409669',
  appId: '1:357936409669:web:c0b89f9d8f1b13fdf9072c',
  measurementId: 'G-NDF54XDW0L',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });

export const signInWithGoogle = async () =>
  await signInWithPopup(auth, googleProvider);

export const firebaseSignout = async () => {
  await signOut(auth);
};

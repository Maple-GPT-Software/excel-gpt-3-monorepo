import { User } from '@/utils/types';
import { createContext } from 'react';

interface AuthUserContext {
  user: User;
  isUserAuthenticated: boolean;
}

export const AuthUserContext = createContext<AuthUserContext>({
  user: {
    uid: '',
    email: '',
    name: '',
    signUpSource: '',
    referrer: '',
  },
  isUserAuthenticated: false,
});

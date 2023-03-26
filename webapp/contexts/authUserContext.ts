import { createContext } from 'react';

import { User } from '@/utils/types';

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

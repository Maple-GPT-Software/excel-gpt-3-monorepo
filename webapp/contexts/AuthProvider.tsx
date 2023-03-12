import { auth } from '@/service/firebase';
import React, { ReactNode, useState, useEffect, createContext, useContext } from 'react';
import { User } from '@firebase/auth-types';
import { useRouter } from 'next/navigation';
import { SIGN_IN_ROUTE } from '@/constants';
import { SIGN_UP_ROUTE } from '../constants';
import AuthService from '@/models/AuthService';

// TODO: additional properties such as logout
// FUTURE: if application increases in complexity we can use immer and useImmerReducer
// to better manage changes to the state
interface AuthContextType {
  firebaseUser: User;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('Missing AuthProvider');
  }

  return context;
}

function AuthProvider({ children }: { children: ReactNode }) {
  /**
   * by default we'll show a loading spinner until firebase has verified the user's last session and we haven't fetched the user's profile
   * if the user tries to access a route that requires them to be authenticated but they aren't we'll redirect them to signin
   * */
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | undefined>(undefined);

  const router = useRouter();

  function redirectUnauhenticatedUserHandler() {
    // we don't need to re-direct if the user accesses these routes unathenticated
    if (location.pathname.includes(SIGN_IN_ROUTE) || location.pathname.includes(SIGN_UP_ROUTE)) {
      return;
    }

    // we replace the history to the user can't navback to the protected route they were at before redirect
    router.replace(SIGN_IN_ROUTE);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      /** if the user was previously logged user !== null */
      if (user) {
        setFirebaseUser(user as User);
      } else {
        redirectUnauhenticatedUserHandler();
      }

      setIsLoading(false);
    });

    return unsubscribe;
  });

  /** Interval for refreshing access token */
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;

      if (user) {
        const token = await user.getIdToken();
        AuthService.setCurrentUser(user as User, token);
      }
    });

    return () => {
      clearInterval(interval);
    };
  });

  if (isLoading && !firebaseUser) {
    return <p>Loading...</p>;
  }

  return <AuthContext.Provider value={{ firebaseUser: firebaseUser as User }}>{children}</AuthContext.Provider>;
}

export default AuthProvider;

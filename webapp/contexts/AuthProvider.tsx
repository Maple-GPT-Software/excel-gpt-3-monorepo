// NPM
import React, { useState, useEffect, createContext, useContext } from 'react';
import { auth } from '@/service/firebase';
import { useRouter } from 'next/navigation';
// COMPONENTS
import CenteredSpinnner from '@/components/ui/CenteredSpinnner';
// SERVICES
import AuthService from '@/models/AuthService';
// CONSTATNS
import { SIGN_IN_ROUTE, SIGN_UP_ROUTE } from '@/constants';
// TYPES
import type { ReactNode } from 'react';
import type { SimplifyUser } from '@/types/simplifyApi';
import type { User } from '@firebase/auth-types';

interface AuthContextType {
  /** user information after firebase authenticates session */
  firebaseUser?: User;
  /** user profile from simplify API */
  simplifyUser?: SimplifyUser;
  setSimplifyUser: React.Dispatch<
    React.SetStateAction<SimplifyUser | undefined>
  >;
}

/**
 * We only render everything in /app/* when the user has been authenticated by firebase and they have an account we
 * use useUserContext which returns AuthContextType but without the optional types
 */
type AuthenticatedSessionType = Required<AuthContextType>;

const AuthContext = createContext<AuthContextType | undefined>(
  {} as AuthContextType
);

// hook to get access to provider values outside of /app/*
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('Missing AuthProvider');
  }

  return context;
}

/** hook to get access to provider values within /app/* */
export function useUserContext(): AuthenticatedSessionType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('Missing AuthProvider');
  }

  return context as AuthenticatedSessionType;
}

function AuthProvider({ children }: { children: ReactNode }) {
  /**
   * by default we'll show a loading spinner until firebase has verified the user's last session and we haven't fetched the user's profile
   * if the user tries to access a route that requires them to be authenticated but they aren't we'll redirect them to signin
   * */
  const [isLoading, setIsLoading] = useState(true);
  const [firebaseUser, setFirebaseUser] = useState<User | undefined>(undefined);
  const [simplifyUser, setSimplifyUser] = useState<SimplifyUser | undefined>(
    undefined
  );

  const router = useRouter();

  function redirectUnauthenticatedUser() {
    // we don't need to re-direct if the user accesses these routes unathenticated
    if (
      location.pathname.includes(SIGN_IN_ROUTE) ||
      location.pathname.includes(SIGN_UP_ROUTE)
    ) {
      return;
    }

    // we replace the history to the user can't navback to the protected route they were at before redirect
    router.replace(SIGN_IN_ROUTE);
  }

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      /** if the user was previously logged user !== null */
      if (user !== null) {
        setFirebaseUser(user as User);
      } else {
        redirectUnauthenticatedUser();
      }

      setIsLoading(false);
    });

    return unsubscribe;
  });

  /**
   * Interval for refreshing access token after firebase initially authenticates user
   * */
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = auth.currentUser;

      if (user !== null) {
        const token = await user.getIdToken();
        AuthService.setCurrentUser(user as User, token);
      }
    });

    return () => {
      clearInterval(interval);
    };
  });

  return (
    <AuthContext.Provider
      value={{
        firebaseUser: firebaseUser as User,
        simplifyUser,
        setSimplifyUser,
      }}
    >
      {isLoading && (
        <div className="bg-white fixed w-full h-full top-0 left-0">
          <CenteredSpinnner>
            <p className="mt-4"> Getting things ready </p>
          </CenteredSpinnner>
        </div>
      )}
      {/* we don't render application while firebase is in the process of authenticating the user */}
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;

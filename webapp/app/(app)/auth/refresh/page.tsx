'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { FunctionComponent } from 'react';
import SimplifyApi from '@/api/SimplifyApi';
import { useAuthContext } from '@/contexts/AuthProvider';
import CenteredSpinnner from '@/components/ui/CenteredSpinnner';
import {
  DASHBOARD_ROUTE,
  ROUTE_BEFORE_REFRESH,
  SIGN_IN_ROUTE,
} from '@/constants';

/**
 * This component will show a loading state until firebase has authenticated the session
 */
const AuthRefresh: FunctionComponent = () => {
  const { setSimplifyUser, firebaseUser, hasFirebasedAuthenticated } =
    useAuthContext();
  const router = useRouter();

  useEffect(() => {
    /**
     * once firebase has authenticated the session firebaseUser is either be a User object or null
     * at this point we can reach out to our API since AuthService will have a valid accessToken
     * */
    if (hasFirebasedAuthenticated) {
      if (firebaseUser) {
        SimplifyApi()
          .login()
          .then(user => {
            const redirectTo = localStorage.getItem(ROUTE_BEFORE_REFRESH);
            setSimplifyUser(user);
            router.replace(redirectTo ?? DASHBOARD_ROUTE);
          })
          .catch(e => {
            router.replace(SIGN_IN_ROUTE);
          });
      } else {
        router.replace(SIGN_IN_ROUTE);
      }
    }
  }, [firebaseUser, hasFirebasedAuthenticated, router, setSimplifyUser]);

  return (
    <div className="fixed top-0 left-0 h-full w-full bg-white">
      <CenteredSpinnner>
        <p className="mt-4"> Getting things ready </p>
      </CenteredSpinnner>
    </div>
  );
};

export default AuthRefresh;

'use client';

import { useEffect } from 'react';
import type { FunctionComponent } from 'react';
import CenteredSpinnner from '@/components/ui/CenteredSpinnner';
import { useRouter } from 'next/navigation';
import {
  DASHBOARD_ROUTE,
  ROUTE_BEFORE_REFRESH,
  SIGN_IN_ROUTE,
} from '@/constants';
import SimplifyApi from '@/api/SimplifyApi';
import { useAuthContext } from '@/contexts/AuthProvider';

/** this */
const AuthRefresh: FunctionComponent = () => {
  const { setSimplifyUser } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
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
  }, []);

  return (
    <div className="bg-white fixed w-full h-full top-0 left-0">
      <CenteredSpinnner>
        <p className="mt-4"> Getting things ready </p>
      </CenteredSpinnner>
    </div>
  );
};

export default AuthRefresh;

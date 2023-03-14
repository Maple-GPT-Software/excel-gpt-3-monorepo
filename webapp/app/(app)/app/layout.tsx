'use client';

import { useEffect } from 'react';
import type { FunctionComponent, ReactNode } from 'react';
import { useAuthContext } from '@/contexts/AuthProvider';
import { useRouter } from 'next/navigation';
import {
  AUTH_REFRESH_ROUTE,
  ROUTE_BEFORE_REFRESH,
  SIGN_IN_ROUTE,
} from '@/constants';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FunctionComponent<AppLayoutProps> = ({ children }) => {
  const { simplifyUser, firebaseUser } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (simplifyUser === undefined && firebaseUser !== undefined) {
      // previously logged in and revisits app
      const currentRoute = window.location.pathname;
      localStorage.setItem(ROUTE_BEFORE_REFRESH, currentRoute);
      router.replace(AUTH_REFRESH_ROUTE);
    } else if (firebaseUser === undefined) {
      // was not previously logged in
      router.replace(SIGN_IN_ROUTE);
    }
  }, []);

  if (simplifyUser === undefined) {
    return null;
  }

  // only render /app/* routes if user profile was succesfully fetched from server
  return (
    <div className="grid grid-cols-[200px_1fr]">
      <div>side nav</div>
      <div>{children}</div>
    </div>
  );
};

export default AppLayout;

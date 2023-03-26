'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { FunctionComponent, ReactNode } from 'react';

import { useAuthContext } from '@/contexts/AuthProvider';

import SideNav from '@/features/SideNav';

import { AUTH_REFRESH_ROUTE, ROUTE_BEFORE_REFRESH } from '@/constants';

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: FunctionComponent<AppLayoutProps> = ({ children }) => {
  const { simplifyUser, firebaseUser } = useAuthContext();
  const router = useRouter();

  // only re-direct on mount
  useEffect(() => {
    // previously logged in and revisits app. Re-direct to refresh so that sesison can be refresh
    if (!simplifyUser || !firebaseUser) {
      const currentRoute = window.location.pathname;
      localStorage.setItem(ROUTE_BEFORE_REFRESH, currentRoute);
      router.replace(AUTH_REFRESH_ROUTE);
    }
  }, []);

  if (!simplifyUser || !firebaseUser) {
    return null;
  }

  // only render /app/* routes if user profile was succesfully fetched from server
  return (
    <div className="grid h-screen w-screen grid-cols-[250px_1fr]">
      <SideNav />
      <div className="h-screen overflow-scroll px-4 pt-12">{children}</div>
    </div>
  );
};

export default AppLayout;

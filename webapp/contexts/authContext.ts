'use client';

import { useAuthContext } from './AuthProvider';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const route = useRouter();
  const authContext = useAuthContext();

  if (
    authContext.hasFirebasedAuthenticated &&
    window.location.pathname === '/signin'
  ) {
    route.push('/dashboard');
  } else if (
    authContext.hasFirebasedAuthenticated &&
    window.location.pathname === '/signup'
  ) {
    route.push('/registration');
  } else if (!authContext.hasFirebasedAuthenticated) {
    route.push('/signin');
  }

  return children;
};

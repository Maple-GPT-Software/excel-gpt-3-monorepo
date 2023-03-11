'use client';
import { useRouter } from 'next/router';
import { ReactNode, useContext } from 'react';
import { AuthUserContext } from './authUserContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const route = useRouter();
  const authContext = useContext(AuthUserContext);

  if (authContext.isUserAuthenticated && window.location.pathname === '/signin') {
    route.push('/dashboard');
  } else if (authContext.isUserAuthenticated && window.location.pathname === '/signup') {
    route.push('/registration');
  } else if (!authContext.isUserAuthenticated) {
    route.push('/signin');
  }

  return children;
};

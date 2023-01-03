import App from './App';
import { ReactNode } from 'react';
import { useRoutes } from 'react-router';

const protectedRoutes: { path: string; element: ReactNode }[] = [
  {
    path: '/',
    element: <App />,
  },
];

function AppRoutes() {
  // TODO: check if user is signed in

  // const routes = auth.user ? protectedRoutes : publicRoutes;

  // const element = useRoutes([...routes, ...commonRoutes]);
  const element = useRoutes([...protectedRoutes]);

  return <>{element}</>;
}

export default AppRoutes;

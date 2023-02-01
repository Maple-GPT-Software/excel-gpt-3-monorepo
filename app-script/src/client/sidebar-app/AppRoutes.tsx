import React from 'react';
import { useRoutes } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';

function AppRoutes() {
  const routes = [
    {
      path: '/',
      element: <Login />,
    },
    {
      path: '/signup',
      element: <SignUp />,
    },
  ];

  const element = useRoutes(routes);

  return <>{element}</>;
}

export default AppRoutes;

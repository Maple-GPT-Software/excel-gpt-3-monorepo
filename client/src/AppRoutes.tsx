import App from './App';
import Chat from './pages/Chat';
import { ReactNode, useState } from 'react';
import { useNavigate, useRoutes } from 'react-router';
import { Link } from 'react-router-dom';

interface Route {
  path: string;
  element: ReactNode;
  children?: Route[];
}

const protectedRoutes: Route[] = [
  {
    path: '/app',
    element: <App />,
    children: [{ path: '/app', element: <Chat /> }],
  },
];

const publicRoutes: Route[] = [
  {
    path: '/signup',
    element: <p> signup </p>,
  },
];

const commonRoute: Route = {
  path: '/',
  element: <TempLandingPage />,
};

function TempLandingPage() {
  const navigate = useNavigate();

  return (
    <Link to="/app"> app</Link>
    // <button
    //   onClick={() => {
    //     console.log('going to app');
    //     navigate('/app');
    //   }}
    // >
    //   To Chat
    // </button>
  );
}

function AppRoutes() {
  // TODO: add actual log-in logic
  const [loggedIn, setLoggedIn] = useState(true);

  const routes = loggedIn ? protectedRoutes : publicRoutes;

  const element = useRoutes([...routes, commonRoute]);

  return <>{element}</>;
}

export default AppRoutes;

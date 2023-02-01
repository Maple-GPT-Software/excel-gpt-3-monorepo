import React, { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

// when there is an error we'll show a modal before login out the user and returning them
// to signed_out state
type AUTHENTICATION_STATES =
  | 'CHECKING_TOKEN'
  | 'AUTHENTICATED'
  | 'ERROR'
  | 'SIGN_IN_ROUTE'
  | 'SIGN_UP_ROUTE';

function App() {
  const [authState, setAuthState] =
    useState<AUTHENTICATION_STATES>('SIGN_IN_ROUTE');
  const [user, setUser] = useState<any>(null);

  function signUpRouteHandler() {
    setAuthState('SIGN_UP_ROUTE');
  }

  function signInRouteHandler() {
    setAuthState('SIGN_IN_ROUTE');
  }

  // useEffect(() => {
  //   // check auth token here and check whether or not to show chat application
  //   setAuthState("CHECKING_TOKEN");

  //   // check token here
  // });

  // if (authState === 'CHECKING_TOKEN') {
  //   return <h1>Loading...</h1>;
  // }

  // if (authState === 'SIGN_IN_ROUTE') {
  //   return <Login />;
  // }

  // if (authState === 'SIGN_UP_ROUTE') {
  //   return <h1>SIGNING UP </h1>;
  // }

  // if (authState === 'AUTHENTICATED') {
  //   return <Chat />;
  // }
  return (
    // weird naming convention that app-scripts use
    // instead of index.html
    <BrowserRouter basename="userCodeAppPanel">
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;

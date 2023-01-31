import React, { useState, useEffect } from 'react';
import Chat from './Chat';
import Login from './Login';

// when there is an error we'll show a modal before login out the user and returning them
// to signed_out state
type AUTHENTICATION_STATES =
  | 'SIGNED_OUT'
  | 'REFRESHING_TOKEN'
  | 'SIGNED_IN'
  | 'ERROR'
  | 'SIGNING_UP';

function App() {
  const [authState, setAuthState] =
    useState<AUTHENTICATION_STATES>('SIGNED_OUT');

  function signUpRouteHandler() {
    setAuthState('SIGNING_UP');
  }

  // useEffect(() => {
  //   // check auth token here and check whether or not to show chat application
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setIsAuthenticated(true);
  //   }, 500);
  // });

  if (authState === 'REFRESHING_TOKEN') {
    return <h1>Loading...</h1>;
  }

  if (authState === 'SIGNED_OUT') {
    return <Login signUpRouteHandler={signUpRouteHandler} />;
  }

  if (authState === 'SIGNING_UP') {
    return <h1>SIGNING UP </h1>;
  }

  return <Chat />;
}

export default App;

import React, { useState } from 'react';
import Login from './Login';
import Chat from './Chat';
import SignUp from './SignUp';
import { Route, Router, useLocation } from 'wouter';

import { isProd } from './settings';
import AuthProvider from './AuthProvider';

// when there is an error we'll show a modal before login out the user and returning them
// to signed_out state

function App() {
  // TODO: get idToken here, if the user was previously logged in
  // the token will be refresh and we'll request the user profile
  // from back-end
  // if not we'll show /signin

  return (
    <Chat />
    // <AuthProvider>
    // {
    // <Route path="/chat">
    // <Chat />
    // </Route> */
    // }
    // {/* </AuthProvider> */}
  );
}

export default App;

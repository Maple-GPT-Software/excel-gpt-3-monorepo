import React, { useState } from 'react';
import Login from './Login';
// import Chat from './Chat';
import SignUp from './SignUp';

// when there is an error we'll show a modal before login out the user and returning them
// to signed_out state
type AUTHENTICATION_STATES =
  | 'CHECKING_TOKEN'
  | 'AUTHENTICATED'
  | 'ERROR'
  | 'SIGN_IN'
  | 'SIGN_UP';

function App() {
  const [route, setRoute] = useState<AUTHENTICATION_STATES>('SIGN_IN');
  const [user, setUser] = useState<any>(null);

  function onRedirectToSignUp() {
    setRoute('SIGN_UP');
  }

  function onRedirectToSignIn() {
    setRoute('SIGN_IN');
  }

  // useEffect(() => {
  //   // check auth token here and check whether or not to show chat application
  //   setAuthState("CHECKING_TOKEN");

  //   // check token here
  // });

  if (route === 'CHECKING_TOKEN') {
    return <h1>Loading...</h1>;
  }

  if (route === 'SIGN_IN') {
    return <Login onRedirectToSignUp={onRedirectToSignUp} />;
  }

  if (route === 'SIGN_UP') {
    return <SignUp onRedirectToSignIn={onRedirectToSignIn} />;
  }

  // if (route === 'AUTHENTICATED') {
  //   return <Chat />;
  // }
}

export default App;

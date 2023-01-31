import React from 'react';
import { getIdToken, signInWithGoogle } from './firebase';

function Login() {
  return (
    <div>
      <button type="button" onClick={signInWithGoogle}>
        sign in with Google
      </button>
      <p>
        No account? <span>Create one</span>
      </p>
      {/* <button onClick={getIdToken}>Get id token</button> */}
    </div>
  );
}

export default Login;

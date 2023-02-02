import React from 'react';
import { getIdToken, signInWithGoogle } from './firebase';

import './Login.style.css';

interface LoginProps {
  onRedirectToSignUp: () => void;
}

function Login({ onRedirectToSignUp }: LoginProps) {
  return (
    <div className="auth-wrapper login-wrapper">
      <h1 className="login-title"> Welcome Back </h1>
      <div className="auth-main">
        <button
          className="button auth-button"
          type="button"
          // onClick={signInWithGoogle}
        >
          sign in with Google
        </button>
        <a className="auth-link" onClick={onRedirectToSignUp}>
          No account? <span>Create one</span>
        </a>
      </div>
      {/* <button onClick={getIdToken}>Get id token</button> */}
    </div>
  );
}

export default Login;

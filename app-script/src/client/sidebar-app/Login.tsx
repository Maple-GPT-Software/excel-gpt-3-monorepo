import React from 'react';
import { Link } from 'react-router-dom';
import { getIdToken, signInWithGoogle } from './firebase';

import './Login.style.css';

function Login() {
  return (
    <div className="auth-wrapper login-wrapper">
      <h1 className="login-title"> Welcome Back </h1>
      <div className="auth-main">
        <button
          className="button auth-button"
          type="button"
          onClick={signInWithGoogle}
        >
          sign in with Google
        </button>
        <Link className="auth-link" to="/signup">
          No account? <span>Create one</span>
        </Link>
      </div>
      {/* <button onClick={getIdToken}>Get id token</button> */}
    </div>
  );
}

export default Login;

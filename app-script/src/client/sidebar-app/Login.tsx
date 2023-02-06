import React from 'react';
import { Link } from 'react-router-dom';
import GoogleIcon from './components/GoogleIcon';
import { useAuthContext } from './AuthProvider';
import { SIGNUP_ROUTE } from './constants';

import './Login.style.css';

function Login() {
  const { loginWithGoogle } = useAuthContext();

  return (
    <div className="auth-wrapper login-wrapper">
      <h1 className="login-title"> Welcome Back </h1>
      <div className="auth-main">
        <button
          onClick={loginWithGoogle}
          className="button auth-button"
          type="button"
        >
          <GoogleIcon />
          <p>Sign in with Google</p>
        </button>
        <p className="auth-link">
          No account? <Link to={SIGNUP_ROUTE}>Create one</Link>
        </p>
      </div>

      <p style={{ textAlign: 'center' }}>Private policy stuff</p>
    </div>
  );
}

export default Login;

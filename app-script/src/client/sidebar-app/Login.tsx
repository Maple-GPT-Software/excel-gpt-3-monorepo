import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from './components/GoogleIcon';
import { useAuthContext } from './AuthProvider';
import { CHAT_ROUTE } from './constants';

import './Login.style.css';

function Login() {
  const { loginWithGoogle, userProfile } = useAuthContext();
  const navigate = useNavigate();

  if (userProfile) {
    return (
      <div className="auth-wrapper login-wrapper">
        <div className="auth-main">
          <button
            onClick={() => {
              navigate(CHAT_ROUTE);
            }}
            className="button auth-button"
            type="button"
          >
            <p>Ooops! Go back.</p>
          </button>
        </div>
      </div>
    );
  }

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
          {/* TODO: our domain */}
          No account?{' '}
          <a href="https://google.com" target="_blank">
            Create one
          </a>
        </p>
      </div>

      {/* TODO: Real links */}
      <p style={{ textAlign: 'center' }}>Private policy stuff</p>
    </div>
  );
}

export default Login;

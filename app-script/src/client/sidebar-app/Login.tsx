import React from 'react';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from './components/GoogleIcon';
import { useAuthContext } from './AuthProvider';
import { CHAT_ROUTE } from './constants';

import './Login.style.css';

function Login({ authErrorMessage }: { authErrorMessage: string }) {
  const { loginWithGoogle, userProfile } = useAuthContext();
  const navigate = useNavigate();

  if (userProfile) {
    return (
      <div className="auth-wrapper login-wrapper">
        <div className="auth-main">
          <button
            onClick={() => {
              navigate(1);
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
        {!!authErrorMessage && (
          <p style={{ color: 'red', marginBottom: '12px' }}>
            {authErrorMessage}
          </p>
        )}
        <p className="auth-link">
          {/* TODO: our domain */}
          No account?{' '}
          <a href="https://excelsimplify.com/auth/signup" target="_blank">
            Create one
          </a>
        </p>
      </div>

      <a
        href="https://www.excelsimplify.com/policies/private-policy"
        target="_blank"
        style={{ textAlign: 'center', color: 'black' }}
      >
        Private policy
      </a>
    </div>
  );
}

export default Login;

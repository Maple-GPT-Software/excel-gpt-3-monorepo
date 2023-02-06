import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import GoogleIcon from './components/GoogleIcon';
import { LOGIN_ROUTE } from './constants';

import './Login.style.css';
import { useAuthContext } from './AuthProvider';

function SignUp() {
  const { signUpWithGoogle } = useAuthContext();

  return (
    <div className="auth-wrapper logout-wrapper">
      <h1>Join Excel Simplify</h1>
      <div className="auth-main">
        <button
          onClick={signUpWithGoogle}
          className="button auth-button"
          type="button"
        >
          <GoogleIcon />
          <p>Sign up with Google</p>
        </button>
        <p className="auth-link">
          Already have an account? <Link to={LOGIN_ROUTE}>Log in</Link>
        </p>
      </div>

      <p style={{ textAlign: 'center' }}>Private policy stuff</p>
    </div>
  );
}

export default SignUp;

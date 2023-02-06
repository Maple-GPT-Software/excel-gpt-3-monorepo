import React from 'react';
import { Link } from 'react-router-dom';

import './Login.style.css';

function Login() {
  async function loginWithGogle() {
    const user = await window.googleAuthPopUp();
    console.log(user);
  }

  return (
    <div className="auth-wrapper login-wrapper">
      <h1 className="login-title"> Welcome Back </h1>
      <div className="auth-main">
        <button
          onClick={loginWithGogle}
          className="button auth-button"
          type="button"
        >
          sign in with Google
        </button>
        <Link to="/signup">
          No account? <span>Create one</span>
        </Link>
      </div>
    </div>
  );
}

export default Login;

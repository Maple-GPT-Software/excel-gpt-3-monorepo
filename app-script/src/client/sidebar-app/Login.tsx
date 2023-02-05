import React from 'react';
import { Link } from 'wouter';

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
        {/* <GoogleLogin
          onSuccess={(creds) => {
            console.log(creds);
          }}
          onError={() => console.log('failed')}
          text="signin"
        /> */}
        <button
          onClick={loginWithGogle}
          className="button auth-button"
          type="button"
        >
          sign in with Google
        </button>
        {/* <a className="auth-link" > */}
        <Link href="/signup">
          No account? <span>Create one</span>
        </Link>
      </div>
    </div>
  );
}

export default Login;

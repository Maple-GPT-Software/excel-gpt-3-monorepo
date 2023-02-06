import React from 'react';
import { Link } from 'react-router-dom';

import './Login.style.css';

function SignUp() {
  return (
    <div className="auth-wrapper logout-wrapper">
      <h1>Join Excel Simplify</h1>
      <div className="auth-main">
        <button className="button auth-button">Sign up with Google</button>
        <Link className="auth-link" to="/login">
          Already have an account? <span>Sign in</span>
        </Link>
      </div>

      <p>Private policy stuff</p>
    </div>
  );
}

export default SignUp;

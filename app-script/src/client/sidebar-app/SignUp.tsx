import React from 'react';
import { Link } from 'wouter';

import './Login.style.css';

// interface SignUpProps {
//   onRedirectToSignIn: () => void;
// }

function SignUp() {
  return (
    <div className="auth-wrapper logout-wrapper">
      <h1>Join Excel Simplify</h1>
      <div className="auth-main">
        <button className="button auth-button">Sign up with Google</button>
        <Link className="auth-link" href="/">
          Already have an account? <span>Sign in</span>
        </Link>
      </div>

      <p>Private policy stuff</p>
    </div>
  );
}

export default SignUp;

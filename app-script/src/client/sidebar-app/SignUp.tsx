import React from 'react';

import './Login.style.css';

interface SignUpProps {
  onRedirectToSignIn: () => void;
}

function SignUp({ onRedirectToSignIn }: SignUpProps) {
  return (
    <div className="auth-wrapper logout-wrapper">
      <h1>Join Excel Simplify</h1>
      <div className="auth-main">
        <button className="button auth-button">Sign up with Google</button>
        <a className="auth-link" onClick={onRedirectToSignIn}>
          Already have an account? <span>Sign in</span>
        </a>
      </div>

      <p>Private policy stuff</p>
    </div>
  );
}

export default SignUp;

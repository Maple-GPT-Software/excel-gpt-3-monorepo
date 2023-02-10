import React from 'react';
import Chat from '../Chat';
import { useAuthContext } from '../AuthProvider';

import './AuthenticatedLayout.style.css';

function AuthenticatedLayout() {
  const { signOut } = useAuthContext();

  console.log('inside AuthenticatedLayout');

  return (
    <div className="main-laytout">
      <nav className="nav">
        {/* placeholder for hamburger menu trigger */}
        <div className="nav-left-wrapper"></div>
        <div className="nav-right-wrapper">
          {/* TODO: action here */}
          <button
            className="nav-tooltip-button"
            aria-label="click to open guide"
          >
            <span>?</span>
          </button>
          <button onClick={signOut} className="button button-logout">
            logout
          </button>
        </div>
      </nav>
      <div className="main-content">
        <Chat />
      </div>
    </div>
  );
}

export default AuthenticatedLayout;

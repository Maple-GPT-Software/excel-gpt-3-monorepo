import React, { useState } from 'react';
import './Menu.style.css';
import { useAuthContext, useAuthenticatedContext } from '../../AuthProvider';
import { SimplifyUserProfile } from '../../api/SimplifyApi';
import ConversationList from './ConversationList';

function Menu() {
  const { signOut, userProfile } = useAuthenticatedContext();
  const [showMenu, setShowMenu] = useState(false);
  const [menuMode, setMenuMode] = useState<'DEFAULT' | 'EDIT_CONVERSATION'>(
    'DEFAULT'
  );

  const trialExpiration = getSubscriptionDaysRemaining(
    userProfile.stripeCurrentPeriodEnd
  );

  return (
    <>
      {/* TODO: don't show when editing  */}
      <nav className="nav">
        {menuMode === 'DEFAULT' && (
          <div
            className="hamburger-menu"
            aria-label={showMenu ? 'open menu' : 'close menu'}
          >
            <input
              type="checkbox"
              onClick={() => setShowMenu((prev) => !prev)}
            />
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
      </nav>
      <div className={`menu-wrapper ${showMenu ? 'show' : ''}`}>
        <div className="menu-main">
          {menuMode === 'DEFAULT' && <ConversationList />}
          {menuMode === 'EDIT_CONVERSATION' && (
            <div> Edit Conversation View </div>
          )}
        </div>

        {menuMode === 'DEFAULT' && (
          <div className="menu-footer">
            {userProfile.stripeStatus === 'trialing' && (
              <div className="trial-warning">
                <span className="trial-warning-text">
                  Trial expires in {trialExpiration} days
                </span>
                {/* TODO: open signin in webapp */}
                <a
                  className="trial-warning-link"
                  href="https://google.com"
                  target="_blank"
                >
                  Upgrade
                </a>
              </div>
            )}
            <button
              aria-label="logout"
              onClick={signOut}
              className="button-logout"
            >
              LOGOUT
              <div className="gg-log-off"></div>
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Menu;

const DAY_IN_SECONDS = 24 * 60 * 60;

function getSubscriptionDaysRemaining(periodEnd: number) {
  const diffInDays = (periodEnd - getCurrentUnixSeconds()) / DAY_IN_SECONDS;

  if (diffInDays > 0) {
    return Math.floor(diffInDays);
  }

  return 0;
}

/**
 * get the current time as seconds since epoch
 */
export function getCurrentUnixSeconds() {
  return Math.floor(Date.now() / 1000);
}

import React from 'react';
import Chat from '../Chat';
import { useAuthContext } from '../AuthProvider';
import { SubscriptionStatuses } from '../api/SimplifyApi';

import './AuthenticatedLayout.style.css';

function AuthenticatedLayout() {
  const { signOut, userProfile } = useAuthContext();

  if (!userProfile) {
    return null;
  }

  const trialExpiration = getSubscriptionDaysRemaining(
    userProfile.stripeCurrentPeriodEnd
  );

  return (
    <div className="main-laytout">
      <nav className="nav">
        {/* placeholder for hamburger menu trigger */}
        <div className="nav-left-wrapper">
          {userProfile.stripeStatus === 'trialing' && (
            <>
              <span className="trial-warning">
                Trial expires in {trialExpiration} days
              </span>
              {/* TODO: open signin in webapp */}
              <a href="https://google.com" target="_blank">
                Upgrade
              </a>
            </>
          )}
        </div>
        <div className="nav-right-wrapper">
          {/* TODO: dropdown menu */}
          {/* <button
            className="nav-tooltip-button"
            aria-label="click to open guide"
          >
            <span>?</span>
          </button> */}
          <button
            aria-label="logout"
            onClick={signOut}
            className="button-logout"
          >
            <div className="gg-log-off"></div>
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

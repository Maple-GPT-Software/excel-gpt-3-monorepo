import React, { useEffect, useState } from 'react';
import './Menu.style.css';
import { useAuthenticatedContext } from '../../AuthProvider';
import ConversationList from './ConversationList';
import { useParams } from 'react-router-dom';

function Menu() {
  // IMPORTANT: we can only parse the conversation out of url because we have 1 route
  // if ever that changes we need a global store for the conversation id
  const { conversationId } = useParams();
  /** id of conversation to highlight or currently being edited */
  const [selectedConversationId, setSelectedConversationId] =
    useState(conversationId);
  const { signOut, userProfile } = useAuthenticatedContext();
  const [showMenu, setShowMenu] = useState(false);
  const [menuMode, setMenuMode] = useState<
    'DEFAULT' | 'EDIT_CONVERSATION' | 'CREATE_CONVERSATION'
  >('DEFAULT');

  function enterCreateConversationMode() {
    setMenuMode('CREATE_CONVERSATION');
  }

  function enterEditConversationMode(id: string) {
    setSelectedConversationId(id);
  }

  function onLeaveEditConversationMode() {
    if (!conversationId) {
      return;
    }

    setSelectedConversationId(conversationId);
  }

  /** sync selected conversation id with the conversationId in the url params */
  useEffect(() => {
    if (conversationId) {
      setSelectedConversationId(conversationId);
    }
  }, [conversationId]);

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
          {menuMode === 'DEFAULT' && (
            <ConversationList selectedConversationId={selectedConversationId} />
          )}
          {menuMode === 'CREATE_CONVERSATION' ||
            (menuMode === 'EDIT_CONVERSATION' && (
              // TODO: when creating/editing pass in mode
              <div> Edit Conversation View </div>
            ))}
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

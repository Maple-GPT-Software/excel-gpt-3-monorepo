import React, { useEffect, useState } from 'react';
import './Menu.style.css';
import { useAuthenticatedContext } from '../../AuthProvider';
import ConversationList from './ConversationList';
import { useNavigate, useParams } from 'react-router-dom';
import {
  CreateConversationForm,
  EditConversationFormWrapper,
} from './ConversationForm';
import useSWR from 'swr';
import SimplifyApi, { DConversation } from '../../api/SimplifyApi';
import conversationKeyFactory from './conversationQueryKeys';
import { CHAT_ROUTE } from '../../constants';

type MenuModes = 'DEFAULT' | 'EDIT_CONVERSATION' | 'CREATE_CONVERSATION';

const MENU_MODE_LABELS: { [key: string]: string } = {
  EDIT_CONVERSATION: 'Edit Conversation',
  CREATE_CONVERSATION: 'Create Conversation',
};

function Menu() {
  // IMPORTANT: we can only parse the conversation out of url because we have 1 route
  // if ever that changes we need a global store for the conversation id
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { signOut, userProfile, accessToken } = useAuthenticatedContext();
  const { data: conversations } = useSWR<DConversation[]>(
    accessToken ? conversationKeyFactory.all : null,
    () => SimplifyApi(accessToken).getConversations()
  );
  const [showMenu, setShowMenu] = useState(false);
  const [menuMode, setMenuMode] = useState<MenuModes>('DEFAULT');

  function enterCreateConversationMode() {
    setMenuMode('CREATE_CONVERSATION');
  }

  function enterEditConversationMode() {
    setMenuMode('EDIT_CONVERSATION');
  }

  function backToDefaultMode() {
    setMenuMode('DEFAULT');
  }

  function updateSelectedId(conversationId: string) {
    navigate(`${CHAT_ROUTE}/${conversationId}`);
  }

  function createNewConversationSuccessCb(conversationId: string) {
    updateSelectedId(conversationId);
    setMenuMode('DEFAULT');
    navigate(`${CHAT_ROUTE}/${conversationId}`);
    setShowMenu(false);
  }

  function toggleShowMenuHandler() {
    if (!showMenu) {
      setShowMenu(true);
      return;
    }

    setShowMenu(false);
  }

  const trialExpiration = getSubscriptionDaysRemaining(
    userProfile.stripeCurrentPeriodEnd
  );

  useEffect(() => {
    if (!conversationId || !conversations || conversations.length === 0) {
      return;
    }

    const isConversationValid = !!conversations.find(
      (conversation) => conversation.id === conversationId
    );

    if (!isConversationValid) {
      navigate(`${CHAT_ROUTE}/${conversations[0].id}`);
    }
  }, [conversationId, conversations]);

  const conversation = React.useMemo(() => {
    if (!conversationId || !conversations || conversations.length === 0) {
      return undefined;
    }

    return conversations.find(
      (conversation) => conversation.id === conversationId
    );
  }, [conversationId, conversations]);

  return (
    <>
      {/* TODO: don't show when editing  */}
      <nav className="nav">
        {menuMode === 'DEFAULT' && (
          <div
            className="hamburger-menu"
            aria-label={showMenu ? 'close menu' : 'open menu'}
          >
            <input
              type="checkbox"
              checked={showMenu}
              onClick={toggleShowMenuHandler}
            />
            <span></span>
            <span></span>
            <span></span>
          </div>
        )}
        {conversation && (
          <p className="nav-conversation-name">{conversation.name}</p>
        )}
      </nav>
      <div className={`menu-wrapper ${showMenu ? 'show' : ''}`}>
        <div className="menu-main">
          {menuMode !== 'DEFAULT' && (
            <div style={{ marginBottom: '24px' }}>
              <button
                className="button button-outline"
                style={{ padding: '6px' }}
                onClick={() => setMenuMode('DEFAULT')}
              >
                back
              </button>
              <p
                style={{
                  color: 'white',
                  marginLeft: '12px',
                  display: 'inline',
                }}
              >
                {MENU_MODE_LABELS[menuMode]}
              </p>
            </div>
          )}
          {menuMode === 'DEFAULT' && (
            <ConversationList
              accessToken={accessToken}
              onCreateConversationClick={enterCreateConversationMode}
              enterEditConversationMode={enterEditConversationMode}
              selectedConversationId={conversationId}
              conversations={conversations || []}
              updateSelectedId={updateSelectedId}
            />
          )}
          {menuMode === 'CREATE_CONVERSATION' && (
            <CreateConversationForm
              conversations={conversations}
              accessToken={accessToken}
              createNewConversationSuccessCb={createNewConversationSuccessCb}
            />
          )}
          {menuMode === 'EDIT_CONVERSATION' && (
            <EditConversationFormWrapper
              conversations={conversations}
              conversationId={conversationId}
              backToMenuDefaultMode={backToDefaultMode}
              accessToken={accessToken}
            />
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

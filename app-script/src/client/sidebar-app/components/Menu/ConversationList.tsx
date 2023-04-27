import React, { useMemo, useRef, useState } from 'react';
import useSWR from 'swr';
import { useAuthenticatedContext } from '../../AuthProvider';
import SimplifyApi, { DConversation } from '../../api/SimplifyApi';
import conversationKeyFactory from './conversationQueryKeys';
import { useSWRConfig } from 'swr';

import './ConversationList.style.css';
import Icon from '../Icon';
import useOnClickOutside from '../../hooks/useOnClickOutside';

interface ConversationListProps {
  accessToken: string;
  selectedConversationId: string | undefined;
  onCreateConversationClick: () => void;
  enterEditConversationMode: () => void;
  conversations: DConversation[];
  updateSelectedId: (k: string) => void;
  toggleConversationSavedHandler: (
    conversation: DConversation | undefined
  ) => Promise<void>;
}

function ConversationList({
  accessToken,
  selectedConversationId,
  onCreateConversationClick,
  enterEditConversationMode,
  conversations,
  updateSelectedId,
  toggleConversationSavedHandler,
}: ConversationListProps) {
  const conversationListRef = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [viewSaved, setViewSaved] = useState(false);

  const { mutate } = useSWRConfig();

  // TODO: deleting conversations bug
  async function deleteConversationHandler(conversationId: string) {
    mutate(
      conversationKeyFactory.all,
      () => SimplifyApi(accessToken).deleteConversation(conversationId),
      {
        populateCache: (deletedConversation: DConversation) => {
          return conversations.filter(
            (conversation) => conversation.id !== deletedConversation.id
          );
        },
      }
    );

    setIsDeleting(false);
  }

  useOnClickOutside(conversationListRef, () => {
    if (isDeleting) {
      setIsDeleting(false);
    }
  });

  const filteredConversations = useMemo(() => {
    if (!viewSaved) {
      return conversations;
    }

    return conversations.filter((conversation) => conversation.isBookmarked);
  }, [conversations, viewSaved]);

  const renderConversationList =
    filteredConversations && filteredConversations.length !== 0;

  return (
    <div className="conversation-list" ref={conversationListRef}>
      <div className="conversation-list-actions">
        <button
          className="new-conversation-button"
          onClick={onCreateConversationClick}
        >
          + New Conversation
        </button>
        <div style={{ margin: '6px 0' }}>
          <label htmlFor="viewSavedOnly">
            <input
              onClick={() => setViewSaved((prev) => !prev)}
              checked={viewSaved}
              type="checkbox"
              id="viewSavedOnly"
            />
            <p style={{ marginLeft: '6px', display: 'inline', color: 'white' }}>
              Only show bookmarked
            </p>
          </label>
        </div>
        <div className="divisor"></div>
      </div>

      <div className="conversation-list-items">
        {(!filteredConversations || filteredConversations.length === 0) && (
          <p style={{ color: 'white', marginTop: '24px' }}>
            <Icon
              strokeColor="white"
              pathName="CHAT"
              height={18}
              width={18}
              styles={{ padding: 0, marginRight: '6px' }}
            />
            {viewSaved
              ? 'No saved conversations.'
              : 'Create a new conversation!'}
          </p>
        )}

        {renderConversationList &&
          filteredConversations.map((conversation) => {
            return (
              <ConversationListItem
                key={conversation.id}
                isDeleting={isDeleting}
                conversation={conversation}
                selectedConversationId={selectedConversationId}
                enterEditConversationMode={enterEditConversationMode}
                updateSelectedId={updateSelectedId}
                deleteConversationHandler={deleteConversationHandler}
                setIsDeleting={setIsDeleting}
                toggleConversationSavedHandler={toggleConversationSavedHandler}
              />
            );
          })}
      </div>
    </div>
  );
}

export default ConversationList;

interface ConversationListItemProps {
  isDeleting: boolean;
  conversation: DConversation;
  selectedConversationId: string | undefined;
  enterEditConversationMode: () => void;
  updateSelectedId: (k: string) => void;
  deleteConversationHandler: (id: string) => Promise<void>;
  setIsDeleting: (value: React.SetStateAction<boolean>) => void;
  toggleConversationSavedHandler: (
    conversation: DConversation | undefined
  ) => Promise<void>;
}

function ConversationListItem({
  isDeleting,
  selectedConversationId,
  conversation,
  enterEditConversationMode,
  updateSelectedId,
  deleteConversationHandler,
  setIsDeleting,
  toggleConversationSavedHandler,
}: ConversationListItemProps) {
  const isSelected = selectedConversationId === conversation.id;

  return (
    <div
      key={conversation.id}
      className={`conversation-item ${isSelected ? 'selected' : ''}`}
      onClick={() => updateSelectedId(conversation.id)}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <Icon
          strokeColor="white"
          pathName="CHAT"
          height={18}
          width={18}
          styles={{ padding: 0, cursor: 'unset' }}
        />
        {/* bookmark/unbookmark icon */}
        <button
          aria-label={
            conversation.isBookmarked
              ? 'unbookmark conversation'
              : 'bookmark conversation'
          }
          className="nav-conversation-save-button"
          onClick={() => toggleConversationSavedHandler(conversation)}
          style={{ marginRight: '6px' }}
        >
          <Icon
            strokeColor="white"
            width={16}
            height={16}
            pathName="BOOKMARK"
            styles={conversation.isBookmarked ? { fill: 'white' } : {}}
          />
        </button>
        <p>{conversation.name}</p>
      </div>
      <div className="conversation-item-actions">
        {isSelected && !isDeleting && (
          <>
            <button
              title="edit conversation"
              onClick={enterEditConversationMode}
            >
              <Icon
                pathName="PENCIL"
                strokeColor="white"
                width={16}
                height={16}
                styles={{ padding: 0 }}
              />
            </button>
            <button
              title="delete conversation"
              onClick={() => setIsDeleting(true)}
            >
              <Icon
                pathName="CLOSE"
                strokeColor="white"
                width={16}
                height={16}
                styles={{ padding: 0 }}
              />
            </button>
          </>
        )}
        {isSelected && isDeleting && (
          <>
            <button
              title="confirm delete"
              onClick={() => deleteConversationHandler(conversation.id)}
            >
              <Icon
                pathName="CHECK"
                strokeColor="white"
                width={20}
                height={20}
                styles={{ padding: 0 }}
              />
            </button>
            <button title="cancel delete" onClick={() => setIsDeleting(false)}>
              <Icon
                pathName="CLOSE"
                strokeColor="white"
                width={20}
                height={20}
                styles={{ padding: 0 }}
              />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

import React, { useRef, useState } from 'react';
import useSWR from 'swr';
import { useAuthenticatedContext } from '../../AuthProvider';
import SimplifyApi, { DConversation } from '../../api/SimplifyApi';
import conversationKeyFactory from './conversationQueryKeys';
import { useSWRConfig } from 'swr';

import './ConversationList.style.css';
import Icon from '../Icon';
import useOnClickOutside from '../../hooks/useOnClickOutside';

function ConversationList({
  accessToken,
  selectedConversationId,
  onCreateConversationClick,
  enterEditConversationMode,
  conversations,
  updateSelectedId,
}: {
  accessToken: string;
  selectedConversationId: string | undefined;
  onCreateConversationClick: () => void;
  enterEditConversationMode: () => void;
  conversations: DConversation[];
  updateSelectedId: (k: string) => void;
}) {
  const conversationListRef = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate } = useSWRConfig();

  // TODO: case where user deletes only conversation, create new by default
  function deleteConversationHandler(conversationId: string) {
    mutate(conversationKeyFactory.all, () =>
      SimplifyApi(accessToken)
        .deleteConversation(conversationId)
        .then((data) => {
          if (conversations.length > 1) {
            updateSelectedId(conversations[0].id);
            setIsDeleting(false);
          }

          return data;
        })
    );
  }

  useOnClickOutside(conversationListRef, () => {
    if (isDeleting) {
      setIsDeleting(false);
    }
  });

  return (
    <div className="conversation-list" ref={conversationListRef}>
      <button
        className="new-conversation-button"
        onClick={onCreateConversationClick}
      >
        + New Conversation
      </button>
      <div className="divisor"></div>
      {conversations?.length &&
        conversations.map((conversation) => {
          const isSelected = selectedConversationId === conversation.id;

          return (
            <div
              key={conversation.id}
              className={`conversation-item ${isSelected ? 'selected' : ''}`}
              onClick={() => updateSelectedId(conversation.id)}
            >
              <p>{conversation.name}</p>
              <div ref={(ref) => {}} className="conversation-item-actions">
                {isSelected && !isDeleting && (
                  <>
                    <button
                      title="edit conversation"
                      onClick={enterEditConversationMode}
                    >
                      <Icon
                        pathName="PENCIL"
                        strokeColor="white"
                        width={18}
                        height={18}
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
                        width={20}
                        height={20}
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
                    <button
                      title="cancel delete"
                      onClick={() => setIsDeleting(false)}
                    >
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
        })}
    </div>
  );
}

export default ConversationList;

import React, { useRef, useState } from 'react';
import useSWR from 'swr';
import { useAuthenticatedContext } from '../../AuthProvider';
import SimplifyApi, { DConversation } from '../../api/SimplifyApi';
import conversationKeyFactory from './conversationQueryKeys';

import './ConversationList.style.css';
import Icon from '../Icon';
import useOnClickOutside from '../../hooks/useOnClickOutside';

function ConversationList({
  selectedConversationId,
}: {
  selectedConversationId: string | undefined;
}) {
  const conversationListRef = useRef<HTMLDivElement>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: conversations } = useSWR<DConversation[]>(
    conversationKeyFactory.all
  );

  useOnClickOutside(conversationListRef, () => {
    setIsDeleting(false);
  });

  return (
    <div className="conversation-list" ref={conversationListRef}>
      <button className="new-conversation-button">+ New Conversation</button>
      <div className="divisor"></div>
      {conversations?.length &&
        conversations.map((conversation) => {
          const isSelected = selectedConversationId === conversation.id;

          return (
            <div
              key={conversation.id}
              className={`conversation-item ${isSelected ? 'selected' : ''}`}
            >
              <p>{conversation.name}</p>
              <div ref={(ref) => {}} className="conversation-item-actions">
                {isSelected && !isDeleting && (
                  <>
                    <button title="edit conversation">
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
                    <button title="confirm delete">
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

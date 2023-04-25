import React, { useEffect } from 'react';
import conversationKeyFactory from './components/Menu/conversationQueryKeys';
import useSWR from 'swr';
import SimplifyApi, { DConversationPromptType } from './api/SimplifyApi';
import { useAuthenticatedContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { CHAT_ROUTE } from './constants';
import { CenteredLoadingEllipsis } from './components/LoadingEllipsis';

function ConversationCheck() {
  const { accessToken } = useAuthenticatedContext();
  const navigate = useNavigate();

  const {
    data: conversations,
    isLoading: loadingConversations,
    mutate,
  } = useSWR(conversationKeyFactory.all, () =>
    SimplifyApi(accessToken).getConversations()
  );

  useEffect(() => {
    if (loadingConversations || !conversations) {
      return;
    }

    if (conversations.length === 0) {
      SimplifyApi(accessToken)
        .createNewConversation({
          name: 'new conversation',
          promptType: DConversationPromptType.googleAppScriptChat,
          temperature: 0.4,
        })
        .then((conversation) => {
          mutate();
          navigate(`${CHAT_ROUTE}/${conversation.id}`, {
            replace: true,
          });
        });
    } else {
      navigate(`${CHAT_ROUTE}/${conversations[0].id}`, {
        replace: true,
      });
    }
  }, [loadingConversations, conversations]);

  return (
    <CenteredLoadingEllipsis>
      <p> loading your conversations </p>
    </CenteredLoadingEllipsis>
  );
}

export default ConversationCheck;

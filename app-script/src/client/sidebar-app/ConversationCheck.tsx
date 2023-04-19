import React, { useEffect } from 'react';
import conversationKeyFactory from './components/Menu/conversationQueryKeys';
import useSWR from 'swr';
import SimplifyApi from './api/SimplifyApi';
import { useAuthenticatedContext } from './AuthProvider';
import { useNavigate } from 'react-router-dom';
import { CHAT_ROUTE } from './constants';

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
      console.log('no conversations');
    } else {
      navigate(`${CHAT_ROUTE}/${conversations[0].id}`, {
        replace: true,
      });
    }
  }, [loadingConversations, conversations]);

  return (
    <h1
      style={{
        textAlign: 'center',
        position: 'fixed',
        top: '50%',
        left: '50%',
        marginLeft: '-25%',
      }}
    >
      Loading Conversations
    </h1>
  );
}

export default ConversationCheck;

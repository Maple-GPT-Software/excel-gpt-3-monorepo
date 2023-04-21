import React, { useEffect } from 'react';
import conversationKeyFactory from './components/Menu/conversationQueryKeys';
import useSWR from 'swr';
import SimplifyApi from './api/SimplifyApi';
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
      // TODO: create first conversatio and re-direct to CHAT_ROUTE
      console.log('no conversations');
    } else {
      navigate(`${CHAT_ROUTE}/${conversations[0].id}`, {
        replace: true,
      });
    }
  }, [loadingConversations, conversations]);

  return (
    <CenteredLoadingEllipsis>
      <p>loading your conversations </p>
    </CenteredLoadingEllipsis>
  );
}

export default ConversationCheck;

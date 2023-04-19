import React from 'react';
import useSWR from 'swr';
import { useAuthenticatedContext } from '../../AuthProvider';
import SimplifyApi from '../../api/SimplifyApi';
import conversationKeyFactory from './conversationQueryKeys';

function ConversationList() {
  const { data: conversations } = useSWR(conversationKeyFactory.all);

  return <div>conversations loaded {conversations.length}</div>;
}

export default ConversationList;

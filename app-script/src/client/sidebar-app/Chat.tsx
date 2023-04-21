import React, { useRef, useCallback, useEffect } from 'react';
import { useImmerReducer } from 'use-immer';
import { CompletionRating, GPTCompletion, UserMessageType } from './types';
import UserPrompt from './components/UserPrompt';
import UserMessage from './components/UserMessage';
import BotMessage from './components/BotMessage';
import ExamplePrompts from './components/ExamplePrompts';
import useSWR from 'swr';

import './Chat.style.css';
import { useParams } from 'react-router-dom';
import messageKeyFactory from './messageQueryFactory';
import SimplifyApi from './api/SimplifyApi';
import { useAuthenticatedContext } from './AuthProvider';
import { CenteredLoadingEllipsis } from './components/LoadingEllipsis';

export interface ChatState {
  /** the state of the application. Fetching when we're waiting for the AI to answer */
  status: 'FETCHING' | 'SUCCESS' | 'FAIL';
  messages: (GPTCompletion | UserMessageType)[];
}

export enum ChatReducerActionTypes {
  ADD_FETCHED_MESSAGES = 'ADD_FETCHED_MESSAGES',
  ADD_USER_PROMPT = 'ADD_USER_PROMPT',
  ADD_GPT_COMPLETION_SUCCESS = 'ADD_GPT_COMPLETION_SUCCESS',
  ADD_GPT_COMPLETION_FAIL = 'ADD_GPT_COMPLETION_FAIL',
  RATE_COMPLETION_OPTIMISTIC = 'RATE_COMPLETION_OPTIMISTIC',
  RATE_COMPLETION_FAILED = 'RATE_COMPLETION_FAILED',
  CLEAR_MESSAGES = 'CLEAR_MESSAGES',
}

export type ChatActions =
  | { type: ChatReducerActionTypes.ADD_USER_PROMPT; payload: UserMessageType }
  | {
      type: ChatReducerActionTypes.ADD_GPT_COMPLETION_SUCCESS;
      payload: GPTCompletion;
    }
  | {
      type: ChatReducerActionTypes.ADD_GPT_COMPLETION_FAIL;
      payload: string;
    }
  | {
      type: ChatReducerActionTypes.RATE_COMPLETION_OPTIMISTIC;
      /** the id of the completion being rated */
      payload: { id: string; rating: CompletionRating };
    }
  | {
      type: ChatReducerActionTypes.RATE_COMPLETION_FAILED;
      /** the id of the completion who's rating needs to be reset */
      payload: string;
    }
  | {
      type: ChatReducerActionTypes.CLEAR_MESSAGES;
    }
  | {
      type: ChatReducerActionTypes.ADD_FETCHED_MESSAGES;
      payload: (GPTCompletion | UserMessageType)[];
    };

const chatReducer = (draft: ChatState, action: ChatActions) => {
  switch (action.type) {
    case ChatReducerActionTypes.ADD_FETCHED_MESSAGES:
      draft.status = 'SUCCESS';
      draft.messages = action.payload;
      break;
    case ChatReducerActionTypes.ADD_USER_PROMPT:
      draft.status = 'FETCHING';
      draft.messages.push(action.payload);
      // when the user adds a prompt we add a temporary completion so that a loading state can be shown
      // when the API call completes we'll remove it and push response as the last entry in the messages array
      draft.messages.push({
        content: '',
        author: 'assistant',
        id: `${Math.random()}`,
        rating: '',
        status: 'success',
      });
      break;
    case ChatReducerActionTypes.ADD_GPT_COMPLETION_SUCCESS:
      draft.status = 'SUCCESS';
      draft.messages.pop();
      draft.messages.push(action.payload);
      break;
    case ChatReducerActionTypes.ADD_GPT_COMPLETION_FAIL:
      draft.status = 'FAIL';
      /** remove most recent placeholder message */
      draft.messages.pop();
      draft.messages.push({
        id: `${Math.random()}`,
        author: 'assistant',
        content: action.payload,
        rating: '',
        status: 'fail',
      });
      break;
    case ChatReducerActionTypes.RATE_COMPLETION_OPTIMISTIC:
      const { id, rating } = action.payload;
      const updatedCompletions = draft.messages.map((message) => {
        if (typeof message === 'string') {
          return message;
        } else if (message.id === id) {
          return { ...message, rating };
        }

        return message;
      });

      draft.messages = updatedCompletions;
      break;
    case ChatReducerActionTypes.RATE_COMPLETION_FAILED:
      const failedMessageId = action.payload;
      const resetFailedCompletionRating = draft.messages.map((message) => {
        if (typeof message === 'string') {
          return message;
        } else if (message.id === failedMessageId) {
          return { ...message, rating };
        }

        return message;
      });

      draft.messages = resetFailedCompletionRating;
      break;
    case ChatReducerActionTypes.CLEAR_MESSAGES:
      /** clear chat */
      draft.messages = [];
    default:
      break;
  }
};

function Chat() {
  const { accessToken } = useAuthenticatedContext();
  const params = useParams();
  const conversationId = params.id;

  const promptWrapperRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [chatState, dispatch] = useImmerReducer<ChatState, ChatActions>(
    chatReducer,
    {
      status: 'FETCHING',
      messages: [],
    }
  );

  const { isLoading: loadingMessages } = useSWR(
    conversationId ? messageKeyFactory.messagesById(conversationId) : null,
    ([, conversationId]) =>
      SimplifyApi(accessToken).getConversationMessages(conversationId),
    {
      onSuccess: (data) => {
        dispatch({
          type: ChatReducerActionTypes.ADD_FETCHED_MESSAGES,
          payload: data as any,
        });
        setTimeout(() => {
          handleScrollToChatBottom();
        }, 0);
      },
    }
  );

  const handleScrollToChatBottom = useCallback(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // TODO: CreateNewChat dummy component that just makes a request to start a new conversation
  return (
    <div className="chat-wrapper">
      <section className="messages-wrapper">
        {loadingMessages && (
          <CenteredLoadingEllipsis>
            <p> loading messsages </p>
          </CenteredLoadingEllipsis>
        )}
        {!chatState.messages.length && !loadingMessages && <ExamplePrompts />}
        {chatState.messages.length &&
          !loadingMessages &&
          chatState.messages.map((message, index) => {
            if (message.author === 'user') {
              return (
                <UserMessage key={index} prompt={message as UserMessageType} />
              );
            } else {
              return (
                <BotMessage
                  dispatch={dispatch}
                  key={index}
                  completion={message as GPTCompletion}
                  requestStatus={chatState.status}
                />
              );
            }
          })}
        <div ref={chatBottomRef} />
      </section>
      <section ref={promptWrapperRef}>
        <UserPrompt
          shouldDisableTextarea={chatState.status === 'FETCHING'}
          dispatch={dispatch}
          scrollToBottomOfChat={handleScrollToChatBottom}
        />
      </section>
    </div>
  );
}

export default Chat;

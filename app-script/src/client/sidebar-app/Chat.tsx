// NPM
import React, { useRef, useCallback } from 'react';
import { useImmerReducer } from 'use-immer';
// TYPES
import { CompletionRating, GPTCompletion } from './types';
// COMPONENTS
import UserPrompt from './components/UserPrompt';
import UserMessage from './components/UserMessage';
import BotMessage from './components/BotMessage';
import ExamplePrompts from './components/ExamplePrompts';

import './Chat.style.css';

export type UserInput = string;

export interface ChatState {
  /** the state of the application. Fetching when we're waiting for the AI to answer */
  status: 'FETCHING' | 'SUCCESS' | 'FAIL';
  messages: (GPTCompletion | UserInput)[];
}

export enum ChatReducerActionTypes {
  ADD_USER_PROMPT = 'ADD_USER_PROMPT',
  ADD_GPT_COMPLETION_SUCCESS = 'ADD_GPT_COMPLETION_SUCCESS',
  ADD_GPT_COMPLETION_FAIL = 'ADD_GPT_COMPLETION_FAIL',
  RATE_COMPLETION_OPTIMISTIC = 'RATE_COMPLETION_OPTIMISTIC',
  RATE_COMPLETION_FAILED = 'RATE_COMPLETION_FAILED',
  CLEAR_MESSAGES = 'CLEAR_MESSAGES',
}

export type ChatActions =
  | { type: ChatReducerActionTypes.ADD_USER_PROMPT; payload: UserInput }
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
    };

const chatReducer = (draft: ChatState, action: ChatActions) => {
  switch (action.type) {
    case ChatReducerActionTypes.ADD_USER_PROMPT:
      draft.status = 'FETCHING';
      draft.messages.push(action.payload);
      // when the user adds a prompt we add a temporary completion so that a loading state can be shown
      // when the API call completes we'll remove it and push response as the last entry in the messages array
      draft.messages.push({
        message: '',
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
        message: action.payload,
        id: `${Math.random()}`,
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
  const promptWrapperRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [chatState, dispatch] = useImmerReducer<ChatState, ChatActions>(
    chatReducer,
    {
      status: 'SUCCESS',
      messages: [],
    }
  );

  const handleScrollToChatBottom = useCallback(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <div className="chat-wrapper">
      <section className="messages-wrapper">
        {!chatState.messages.length && <ExamplePrompts />}
        {!!chatState.messages.length &&
          chatState.messages.map((message, index) => {
            if (typeof message === 'string') {
              return <UserMessage key={index} prompt={message as UserInput} />;
            } else {
              return (
                <BotMessage
                  dispatch={dispatch}
                  key={index}
                  completion={message as GPTCompletion}
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

// NPM
import React, { useRef, useCallback } from 'react';
import { useImmerReducer } from 'use-immer';
// TYPES
import { GPTCompletion } from './types';
// HOOKS
import { useAuthContext } from './AuthProvider';
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
}

export type ChatActions =
  | { type: ChatReducerActionTypes.ADD_USER_PROMPT; payload: UserInput }
  | {
      type: ChatReducerActionTypes.ADD_GPT_COMPLETION_SUCCESS;
      payload: GPTCompletion;
    }
  | {
      type: ChatReducerActionTypes.ADD_GPT_COMPLETION_FAIL;
      payload: GPTCompletion;
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
        rating: undefined,
        status: 'success',
      });
      break;
    case ChatReducerActionTypes.ADD_GPT_COMPLETION_SUCCESS:
      draft.status = 'SUCCESS';
      /** remove most recent placeholder message */
      draft.messages.pop();
      // TODO: replace with action.payload
      draft.messages.push({
        message: 'CODE_BLOCK\n=AVERAGE(range)',
        id: `${Math.random()}`,
        rating: undefined,
        status: 'success',
      });
      break;
    case ChatReducerActionTypes.ADD_GPT_COMPLETION_FAIL:
      draft.status = 'FAIL';
      /** remove most recent placeholder message */
      draft.messages.pop();
      draft.messages.push({
        message: 'Unexpected error. Please retry your question.',
        id: `${Math.random()}`,
        rating: undefined,
        status: 'fail',
      });
      break;
  }
};

async function getCompletion(prompt: string): Promise<GPTCompletion> {
  // TODO: base URL
  // return await fetch(`${settings.promptBaseUrl}`, {
  return await fetch(`localhost:3000`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // TODO: version number and custom header
      Client: 'google-sheet-version',
    },
    body: JSON.stringify({ prompt }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => data);
}

function scrollToBottom(element: HTMLElement) {
  element.scroll({
    behavior: 'auto',
    top: element.scrollHeight,
  });
}

function Chat() {
  const { signOut } = useAuthContext();

  const promptWrapperRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [chatState, dispatch] = useImmerReducer<ChatState, ChatActions>(
    chatReducer,
    {
      status: 'SUCCESS',
      messages: [],
    }
  );

  // TODO: scrolling to bottom after user prompt/completion is added
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
                <BotMessage key={index} completion={message as GPTCompletion} />
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

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
  status: 'FETCHING' | 'SUCCESS' | 'FAIL';
  messages: (GPTCompletion | UserInput)[];
}

export type ChatActions =
  | { type: 'ADD_USER_PROMPT'; payload: UserInput }
  | { type: 'ADD_GPT_COMPLETION_SUCCESS'; payload: GPTCompletion }
  | { type: 'ADD_GPT_COMPLETION_FAIL'; payload: GPTCompletion };

const chatReducer = (draft: ChatState, action: ChatActions) => {
  switch (action.type) {
    case 'ADD_USER_PROMPT':
      draft.status = 'FETCHING';
      draft.messages.push(action.payload);
      // when the user adds a prompt we add a temporary completion so that a loading state can be shown
      // we mirror the behaviour of recipient is typing
      // when the API call completes we'll remove it and push response as the last entry in the array
      draft.messages.push({
        choices: [],
        id: `${Math.random()}`,
        model: 'DUMMY_MODEL',
        object: 'DUMMY_OBJECT',
      });
      break;
    case 'ADD_GPT_COMPLETION_SUCCESS':
      draft.status = 'SUCCESS';
      draft.messages.pop();
      // TODO: replace with action.payload
      draft.messages.push({
        choices: [
          {
            finish_reason: 'success',
            index: 0,
            text: 'CODE_BLOCK\n=AVERAGE(range)',
          },
        ],
        id: `${Math.random()}`,
        // TODO: SPECIFY MODEL
        model: 'DEVELOPMENT_MODEL',
        object: 'DEVELOPMENT_OBJECT',
      });
      break;
    case 'ADD_GPT_COMPLETION_FAIL':
      draft.status = 'FAIL';
      draft.messages.pop();
      // TODO: replace with action.payload
      draft.messages.push({
        choices: [
          { finish_reason: 'success', index: 0, text: 'some response' },
        ],
        id: `${Math.random()}`,
        model: 'DEVELOPMENT_MODEL',
        object: 'DEVELOPMENT_OBJECT',
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
      <button onClick={signOut} style={{ position: 'absolute' }}>
        Logout
      </button>
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
        />
      </section>
    </div>
  );
}

export default Chat;

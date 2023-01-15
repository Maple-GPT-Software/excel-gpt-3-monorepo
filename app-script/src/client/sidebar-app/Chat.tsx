// NPM
import React, { useRef, useState, useCallback } from 'react';
import { useImmerReducer } from 'use-immer';
// CUSTOM HOOKS
import useAutosizeTextArea from './hooks/useAutosizeTextArea';
// TYPES
import { GPTCompletion } from './types';
// COMPONENTS
import UserMessage from './components/UserMessage';
import BotMessage from './components/BotMessage';

import './Chat.style.css';
import ExamplePrompts from './components/ExamplePrompts';

interface ChatState {
  status: 'FETCHING' | 'SUCCESS' | 'FAIL';
  messages: (GPTCompletion | string)[];
}

type ChatActions =
  | { type: 'ADD_USER_PROMPT'; payload: string }
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
  //   const inputRef = useRef<HTMLInputElement>(null);
  const [userInput, setUserInput] = useState('');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const promptWrapperRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [chatState, dispatch] = useImmerReducer<ChatState, ChatActions>(
    chatReducer,
    {
      status: 'SUCCESS',
      messages: [],
    }
  );

  useAutosizeTextArea(textAreaRef.current, userInput);

  const handleScrollToChatBottom = useCallback(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  async function handleSubmit() {
    dispatch({ type: 'ADD_USER_PROMPT', payload: userInput });
    // scroll to bottom of chat container after user's prompt is added
    setTimeout(() => {
      handleScrollToChatBottom();
    });
    // TODO: call API here

    // ONLY FOR TESTING
    setTimeout(() => {
      dispatch({
        type: 'ADD_GPT_COMPLETION_SUCCESS',
        payload: {
          choices: [
            { finish_reason: 'success', index: 0, text: 'some response' },
          ],
          id: `${Math.random()}`,
          model: 'DEVELOPMENT_MODEL',
          object: 'DEVELOPMENT_OBJECT',
        },
      });
      // scroll to bottom of chat container after completion is added
      setTimeout(() => {
        handleScrollToChatBottom();
      });
    }, 500);

    setUserInput('');
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey && userInput) {
      e.preventDefault();
      handleSubmit();
    }
  }

  function ønChangeHandler(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target?.value;
    setUserInput(value);
  }

  return (
    <div className="chat-wrapper">
      <section className="messages-wrapper">
        {!chatState.messages.length && <ExamplePrompts />}
        {!!chatState.messages.length &&
          chatState.messages.map((message, index) => {
            if (typeof message === 'string') {
              return <UserMessage key={index} prompt={message} />;
            } else {
              return <BotMessage key={index} completion={message} />;
            }
          })}
        <div ref={chatBottomRef} />
      </section>
      <section className="prompt-wrapper" ref={promptWrapperRef}>
        <textarea
          ref={textAreaRef}
          value={userInput}
          aria-label="user-prompt"
          onKeyDown={handleInputKeyDown}
          onChange={ønChangeHandler}
        />
        <div className="prompt-submit" onClick={handleSubmit} />
      </section>
    </div>
  );
}

export default Chat;

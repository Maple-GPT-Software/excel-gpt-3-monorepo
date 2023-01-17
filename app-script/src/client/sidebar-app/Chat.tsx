// NPM
import React, { useRef, useState, useCallback } from 'react';
import { useImmerReducer } from 'use-immer';
// CUSTOM HOOKS
import useAutosizeTextArea from './hooks/useAutosizeTextArea';
import useOnClickOutside from './hooks/useOnClickOutside';
// TYPES
import { GPTCompletion } from './types';
// COMPONENTS
import UserMessage from './components/UserMessage';
import BotMessage from './components/BotMessage';
// UTILS
import { serverFunctions } from '../utils/serverFunctions';

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
  const promptWrapperRef = useRef<HTMLDivElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const [chatState, dispatch] = useImmerReducer<ChatState, ChatActions>(
    chatReducer,
    {
      status: 'SUCCESS',
      messages: [],
    }
  );

  //   useAutosizeTextArea(textAreaRef.current, userInput);

  const handleScrollToChatBottom = useCallback(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  async function handleSubmit() {
    if (!userInput) return;
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

  /**
   * this function is passed down to ChatInput,
   * when the user clicks on one of the options menu items
   * the returned string is appended to the user's input
   */
  function userInputModifier(enhancement: string) {
    setUserInput(`${userInput} ${enhancement}`);
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
        <ChatInput
          value={userInput}
          chatState={chatState.status}
          onKeyDownHandler={handleInputKeyDown}
          changeHandler={ønChangeHandler}
          submitHandler={handleSubmit}
          userInputModifier={userInputModifier}
        />
      </section>
    </div>
  );
}

export default Chat;

interface ChatInputProps {
  value: string;
  chatState: ChatState['status'];
  onKeyDownHandler: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  changeHandler: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  submitHandler: () => Promise<void>;
  userInputModifier: (enhancement: string) => void;
}

const ChatInput = (props: ChatInputProps) => {
  const {
    value,
    chatState,
    onKeyDownHandler,
    changeHandler,
    submitHandler,
    userInputModifier,
  } = props;
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const propMenuWrapperRef = useRef<HTMLDivElement>(null);

  useAutosizeTextArea(textAreaRef?.current, value);
  useOnClickOutside(propMenuWrapperRef, () => setIsMenuOpen(false));

  async function getSelectedFormulaHandler() {
    try {
      const formula = await serverFunctions.getSelectedCellFormula();
      if (formula) {
        userInputModifier('\n' + formula);
      }
      setTimeout(() => {
        setIsMenuOpen(false);
      }, 100);
    } catch (error) {}
  }

  async function getSelectedRangeValuesHandler() {
    try {
      const rangeValueObj = await serverFunctions.getSelectedRangeValues();
      if (rangeValueObj) {
        userInputModifier(
          `\nRange: ${rangeValueObj.range}\n\nData table:${rangeValueObj.values}\n`
        );
        setIsMenuOpen(false);
      }
    } catch (error) {}
  }

  return (
    <>
      <textarea
        ref={textAreaRef}
        value={value}
        aria-label="user-prompt"
        onKeyDown={onKeyDownHandler}
        onChange={changeHandler}
        disabled={chatState === 'FETCHING'}
      />
      <div className="prompt-menu-wrapper" onClick={() => setIsMenuOpen(true)}>
        <div className="prompt-menu">
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
      {isMenuOpen && (
        <div ref={propMenuWrapperRef} className="prompt-options-menu">
          <p onClick={getSelectedFormulaHandler}>Insert selected formula </p>
          <p onClick={getSelectedRangeValuesHandler}>Insert selected range </p>
        </div>
      )}
      <div className="prompt-submit" onClick={submitHandler} />
    </>
  );
};

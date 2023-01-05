import SendIcon from '@mui/icons-material/Send';
import TextField from '@mui/material/TextField';
import { Box } from '@mui/system';
import { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useImmerReducer } from 'use-immer';
import { BotMessage, UserMessage } from '~shared/components/Message';
import useChatMode from '~shared/hooks/useChatMode';
import { ChatModes, GPTCompletion } from '~shared/types';
import settings from '~src/settings';

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
          { finish_reason: 'success', index: 0, text: 'some response' },
        ],
        id: `${Math.random()}`,
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

async function getFormulaCompletion(
  prompt: string,
  mode: ChatModes
): Promise<GPTCompletion> {
  return await fetch(`${settings.promptBaseUrl}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, mode }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => data);
}

// TODO: for conversations we'll pass in a messages array
function Chat() {
  const loation = useLocation();
  const chatMode = useChatMode();
  const inputRef = useRef<HTMLInputElement>(null);
  const [chatState, dispatch] = useImmerReducer<ChatState, ChatActions>(
    chatReducer,
    {
      status: 'SUCCESS',
      messages: [],
    }
  );

  console.log(location);

  async function handleSubmit() {
    if (!inputRef.current?.value) return;

    dispatch({ type: 'ADD_USER_PROMPT', payload: inputRef.current?.value });

    getFormulaCompletion(inputRef.current?.value, chatMode).then(
      (completion) => {
        dispatch({ type: 'ADD_GPT_COMPLETION_SUCCESS', payload: completion });
      }
    );

    // reset user input
    inputRef.current.value = '';
  }

  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey && inputRef.current) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <Box className="chat-parent-container" sx={{ height: '100%' }}>
      <Box
        className="chat-container"
        sx={{ height: 'calc(100% - 60px)', overflow: 'scroll' }}
      >
        {!!chatState.messages.length &&
          chatState.messages.map((message, index) => {
            if (typeof message === 'string') {
              return <UserMessage key={index} prompt={message} />;
            } else {
              return <BotMessage key={index} completion={message} />;
            }
          })}
      </Box>
      <Box
        className="user-input-container"
        sx={{
          width: '350px',
          position: 'fixed',
          bottom: '10px',
          left: '25px',
          backgroundColor: 'white',
          boxShadow: '0px -14px 32px 0px rgba(163,163,163,0.59)',
        }}
      >
        <div style={{ position: 'relative' }}>
          <label htmlFor="user-input" style={{ display: 'none' }}>
            user
          </label>
          <TextField
            sx={{ width: '100%' }}
            id="user-input"
            variant="outlined"
            inputRef={inputRef}
            onKeyDown={handleInputKeyDown}
            multiline
          />
          <SendIcon
            fontSize="small"
            onClick={handleSubmit}
            color="primary"
            sx={{ position: 'absolute', bottom: '16px', right: '10px' }}
          />
        </div>
      </Box>
    </Box>
  );
}

export default Chat;

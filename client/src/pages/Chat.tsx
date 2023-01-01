import {useRef} from 'react';
import { useImmerReducer } from "use-immer";
import { Box } from "@mui/system";
import UserMessage from "../../shared/components/UserMessage";
import BotMessage from "../../shared/components/BotMessage";
import {GPTCompetion} from '../../shared/types';

interface ChatState {
  status: "FETCHING" | "SUCCESS" | "FAIL";
  messages: (GPTCompetion | string)[];
}

type ChatActions =
  | { type: "ADD_USER_PROMPT"; payload: string }
  | { type: "ADD_GPT_COMPLETION_SUCCESS"; payload: GPTCompetion }
  | { type: "ADD_GPT_COMPLETION_FAIL"; payload: GPTCompetion };

const chatReducer = (draft: ChatState, action: ChatActions) => {
  switch (action.type) {
    case "ADD_USER_PROMPT":
      draft.status = "FETCHING";
      draft.messages.push(action.payload);
      // when the user adds a prompt we add a temporary completion so that a loading state can be shown
      // we mirror the behaviour of recipient is typing
      // when the API call completes we'll remove it and push response as the last entry in the array
      draft.messages.push({
        choices: [],
        id: `${Math.random()}`,
        model: "DUMMY_MODEL",
        object: "DUMMY_OBJECT",
      });
      break;
    case "ADD_GPT_COMPLETION_SUCCESS":
      draft.status = "SUCCESS";
      draft.messages.pop();
      // TODO: replace with action.payload
      draft.messages.push({
        choices: [
          { finish_reason: "success", index: 0, text: "some response" },
        ],
        id: `${Math.random()}`,
        model: "DEVELOPMENT_MODEL",
        object: "DEVELOPMENT_OBJECT",
      });
      break;
    case "ADD_GPT_COMPLETION_FAIL":
      draft.status = "FAIL";
      draft.messages.pop();
      // TODO: replace with action.payload
      draft.messages.push({
        choices: [
          { finish_reason: "success", index: 0, text: "some response" },
        ],
        id: `${Math.random()}`,
        model: "DEVELOPMENT_MODEL",
        object: "DEVELOPMENT_OBJECT",
      });
      break;
  }
};

async function getFormulaCompletion(prompt: string): Promise<GPTCompletion> {
  return await fetch("http://127.0.0.1:5000/prompt", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt: prompt }),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => data);
}

function Chat(props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [chatState, dispatch] = useImmerReducer<ChatState, ChatActions>(
    chatReducer,
    {
      status: "SUCCESS",
      messages: [],
    }
  );

async function handleSubmit() {
    if (!inputRef.current?.value) return;

    dispatch({type: "ADD_USER_PROMPT", payload: inputRef.current?.value});
    // const completion = getFormulaCompletion(inputRef.current?.value);

    // reset user input
    inputRef.current.value = "";

    dispatch({type: "ADD_GPT_COMPLETION_SUCCESS"})
  }


  function handleInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.shiftKey && inputRef.current) {
      e.preventDefault();
      handleSubmit();
    }
  }

  return (
    <Box className="chat-container">
      <Box className="chat-container" sx={{ height: "calc(100% - 120px)" }}>
        {!!chatState.messages.length && (
          chatState.messages.map((message, index) => {
            if (typeof message === "string") {
              return <UserMessage key={index} prompt={message} />;
            } else {
              return (
                <BotMessage key={index} completion={message} />
            );
            }
          })
        )}
      </Box>
      <Box className="user-input-container">
        <label htmlFor="user-input" style={{ display: "none" }}>
          user
        </label>
        <input
            id="user-input"
            type="text-area"
            ref={inputRef}
            onKeyDown={handleInputKeyDown}
          />
      </Box>
    </Box>
  );
}

export default Chat;

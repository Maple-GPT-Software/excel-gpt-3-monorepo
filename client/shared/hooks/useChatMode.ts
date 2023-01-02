import { useSearchParams } from 'react-router-dom';
import {
  CHAT_BASE_URL,
  CHAT_FORMULA_MODE,
  CHAT_MODE_URL_PARAM,
} from '~shared/constants';
import { ChatModes } from '~shared/types';

/**
 * this hook returns the current chat mode, e.g formula, knowledge
 * so that we can pass it as part of the prompt API calls. The default
 * is formula
 */
export default function useChatMode(): ChatModes {
  const [searchParams] = useSearchParams();

  if (!location.pathname.includes(CHAT_BASE_URL)) {
    throw new Error('only use this hook within the "chat" route');
  }

  // default to formula mode
  return (
    (searchParams.get(CHAT_MODE_URL_PARAM) as ChatModes) || CHAT_FORMULA_MODE
  );
}

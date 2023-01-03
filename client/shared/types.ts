/** Response when querying prompt API */
import { CHAT_FORMULA_MODE } from "./constants";
import { CHAT_KNOWLEDGE_MODE } from "./constants";
export interface GPTCompletion {
  choices: { finish_reason: string; index: number; text: string }[];
  id: string;
  model: string;
  object: string;
}

/** Possible values for /chat?mode=MODE */
export type ChatModes = typeof CHAT_FORMULA_MODE | typeof CHAT_KNOWLEDGE_MODE;

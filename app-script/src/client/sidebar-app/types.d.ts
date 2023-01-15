// CHAT TYPES

export interface GPTCompletion {
    choices: { finish_reason: string; index: number; text: string }[];
    id: string;
    model: string;
    object: string;
  }
  
import Joi from 'joi';
import { CompletionRating } from '@src/models/message.model';
import { ClientSources } from '@src/types';

const MAXIMUM_PROMPT_CHARACTERS = 400;

export const createMessage = {
  body: Joi.object().keys({
    // 5 seems like a reasonable minimum???
    prompt: Joi.string().optional().min(5).max(MAXIMUM_PROMPT_CHARACTERS).required(),
    /** the client that the prompt is coming from, e.g APPSCRIPT */
    source: Joi.string()
      .valid(...Object.values(ClientSources))
      .required(),
  }),
};

export const rateMessage = {
  body: Joi.object().keys({
    rating: Joi.string()
      .valid(...Object.values(CompletionRating))
      .required(),
  }),
};

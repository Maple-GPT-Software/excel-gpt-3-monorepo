import Joi from 'joi';

import { DMessageRating, IClientSource } from '../types';

// TODO: change character count limit in app-script
const MAXIMUM_PROMPT_CHARACTERS = 800;

export const createMessage = {
  body: Joi.object().keys({
    // 5 seems like a reasonable minimum???
    prompt: Joi.string().optional().min(5).max(MAXIMUM_PROMPT_CHARACTERS).required(),
    /** the client that the prompt is coming from, e.g APPSCRIPT */
    source: Joi.string()
      .valid(...Object.values(IClientSource))
      .required(),
  }),
};

export const rateMessage = {
  body: Joi.object().keys({
    rating: Joi.string()
      .valid(...Object.values(DMessageRating))
      .required(),
  }),
};

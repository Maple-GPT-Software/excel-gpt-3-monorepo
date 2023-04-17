import Joi from 'joi';

import { DConversation, IClientSource, PartialBy } from '../types';
import { SYSTEM_PROMPT_MAP } from '../constants';

export const newConversation = {
  body: Joi.object().keys({
    systemPromptKey: Joi.string()
      .valid(...Object.keys(SYSTEM_PROMPT_MAP))
      .required(),
    temperature: Joi.number().min(0).max(2).required(),
    source: Joi.string()
      .valid(...Object.values(IClientSource))
      .required(),
  }),
};

export const editConversation = {
  body: Joi.object().keys({
    isSaved: Joi.boolean().optional(),
    name: Joi.string().optional(),
  }),
};

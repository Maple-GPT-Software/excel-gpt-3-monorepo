import Joi from 'joi';

import { DConversationPromptType, IClientSource } from '../types';

export const newConversation = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    promptType: Joi.string()
      .valid(...Object.keys(DConversationPromptType))
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

import Joi from 'joi';
import { CompletionRating } from '@src/models/message.model';

const MAXIMUM_PROMPT_CHARACTERS = 400;

export const createMessage = {
  body: Joi.object().keys({
    // 5 seems like a reasonable minimum???
    prompt: Joi.string().optional().min(5).max(MAXIMUM_PROMPT_CHARACTERS).required(),
  }),
};

export const rateMessage = {
  body: Joi.object().keys({
    rating: Joi.string().valid(...Object.values(CompletionRating)).required()
  })
}
import { CompletiongRating } from '@src/models/message.model';
import Joi from 'joi';

const MAXIMUM_PROMPT_CHARACTERS = 400;

export const createMessage = {
  body: Joi.object().keys({
    // 5 seems like a reasonable minimum???
    referrer: Joi.string().optional().min(5).max(MAXIMUM_PROMPT_CHARACTERS).required(),
  }),
};

export const rateMessage = {
  body: Joi.object().keys({
    rating: Joi.string().valid(...Object.values(CompletiongRating)).required()
  })
}
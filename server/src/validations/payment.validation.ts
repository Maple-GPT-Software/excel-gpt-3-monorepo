import Joi from 'joi';
import { PRICE_IDS } from '@src/constants';

const baseCheckoutSchema = Joi.object().keys({
  // FUTURE_WORK: add other price ids later on, e.g monthly team pricing
  priceId: Joi.string().valid(PRICE_IDS.LIFETIME_CHAT_ACCESS),
  successUrl: Joi.string().required(),
  cancelUrl: Joi.string().required(),
});

/** validates if price id in payload is valid */
export const validateCheckoutSession = {
  body: baseCheckoutSchema,
};

export const validateLifetimeAccessSession = {
  body: baseCheckoutSchema.keys({
    openaiApiKey: Joi.string().required(),
  }),
};

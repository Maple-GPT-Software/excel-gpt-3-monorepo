import Joi from 'joi';
import { PRICE_IDS } from '@src/constants';

/** validates if price id in payload is valid */
export const validateCheckoutSession = {
  body: Joi.object().keys({
    // FUTURE_WORK: add other price ids later on, e.g monthly team pricing
    priceId: Joi.string().valid(PRICE_IDS.LIFETIME_CHAT_ACCESS),
    successUrl: Joi.string().required(),
    cancelUrl: Joi.string().required(),
  }),
};

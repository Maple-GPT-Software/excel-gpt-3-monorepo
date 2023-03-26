import Joi from 'joi';

import settings from '../settings';

const baseCheckoutSchema = Joi.object().keys({
  // FUTURE_WORK: add other price ids later on, e.g monthly team pricing
  priceId: Joi.string().valid(...Object.values(settings.stripePriceIds)),
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

import Joi from 'joi';

import settings from '../settings';

const baseCheckoutSchema = Joi.object().keys({
  priceId: Joi.string().valid(...Object.values(settings.stripePriceIds)),
  successUrl: Joi.string().required(),
  cancelUrl: Joi.string().required(),
});

/** validates if price id in payload is valid */
export const validateCheckoutSession = {
  body: baseCheckoutSchema,
};

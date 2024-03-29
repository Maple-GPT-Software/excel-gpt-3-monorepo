import Joi from 'joi';

export const firebaseSignup = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    referrer: Joi.string().optional().allow(''),
    hasAcceptedTerms: Joi.boolean().required(),
    openaiApiKey: Joi.string().optional().allow(''),
  }),
};

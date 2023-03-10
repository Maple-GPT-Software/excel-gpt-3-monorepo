import Joi from 'joi';

export const firebaseSignup = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    referrer: Joi.string().optional(),
    hasAcceptedTerms: Joi.boolean().required(),
  }),
};

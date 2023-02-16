import Joi from 'joi';

// checking if a signUpSource has been provided,
// e.g "app-script", "web-app", "excel", etc...
export const firebaseSignup = {
  body: Joi.object().keys({
    referrer: Joi.string().optional(),
    signUpSource: Joi.string().required(),
  }),
};

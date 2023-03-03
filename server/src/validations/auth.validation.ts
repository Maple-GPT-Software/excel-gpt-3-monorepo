import Joi from 'joi';

export const firebaseSignup = {
  body: Joi.object().keys({
    referrer: Joi.string().optional(),
    // TODO: deprecate signup source since signup can only happen through webapp
    signUpSource: Joi.string().required(),
  }),
};

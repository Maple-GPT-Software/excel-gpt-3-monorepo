const Joi = require('joi');
const { signUpSource } = require('./custom.validation');

const register = {
  body: Joi.object().keys({
    emial: Joi.string().required().email(),
    displayName: Joi.string().required(),
    createTime: Joi.string().required(),
    referrer: Joi.string().optional(),
    signUpSource: Joi.string().required(),
  }),
};


module.exports = {
  register
};

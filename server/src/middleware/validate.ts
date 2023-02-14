import { NextFunction, Response } from 'express';
import Joi from 'joi';
import httpStatus from 'http-status';
import pick from '@src/utils/pick';
import ApiError from '@src/utils/ApiError';

import { AuthenticatedRequest } from '@src/types';

const validate = (schema: any) => (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const object = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

export default validate;

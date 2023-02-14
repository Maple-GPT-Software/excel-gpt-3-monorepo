import { RequestHandlerWithAuth } from '@src/types';

const catchAsync =
  (fn: RequestHandlerWithAuth): RequestHandlerWithAuth =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };

export default catchAsync;

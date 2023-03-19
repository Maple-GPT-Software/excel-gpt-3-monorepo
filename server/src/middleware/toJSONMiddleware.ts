import { Request, Response, NextFunction } from 'express';
import { Document } from 'mongoose';

/**
 * This middlewares intercepts res.send and converts any mongoose documents into plain JS objects
 * Note: in the model schema we specify which properties should be deleted from the JS object before
 * it is sent to the client apps
 * */
function toJSONMiddleware(req: Request, res: Response, next: NextFunction) {
  const { send } = res;
  res.send = function (body) {
    if (body instanceof Document) {
      return send.call(res, body.toJSON());
    }
    return send.call(res, body);
  };
  next();
}

export default toJSONMiddleware;

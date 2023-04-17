import { RequestHandler } from 'express';
import httpStatus from 'http-status';

import { Conversation, DConversationObject } from '../models/conversation.model';
import ApiError from '../utils/ApiError';

export const addConversationToRequest: RequestHandler = async (req, res, next) => {
  try {
    const { conversationId } = req.query;
    const { uid: userId } = req.decodedFirebaseToken;

    const conversation = (await Conversation.findById(conversationId))?.toObject();

    if (conversation === undefined) {
      next(new ApiError(httpStatus.NOT_FOUND, 'Conversation not found'));
      return;
    }

    if (conversation.userId !== userId) {
      next(new ApiError(httpStatus.FORBIDDEN, 'Access forbidden'));
      return;
    }

    req.conversation = conversation as DConversationObject;

    next();
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to retrieve conversaton'));
  }
};

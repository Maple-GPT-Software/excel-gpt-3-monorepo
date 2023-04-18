import { RequestHandler } from 'express';
import httpStatus from 'http-status';

import { Conversation, DConversationObject } from '../models/conversation.model';
import ApiError from '../utils/ApiError';

/** middleware that adds the conversation as a property of request */
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

/** middleware that checks if the user has access to the conversation */
export const canAccessConversation: RequestHandler = async (req, res, next) => {
  const { id } = req.params;
  const { uid: userId } = req.decodedFirebaseToken;

  try {
    const conversation = (await Conversation.findById(id))?.toObject();

    if (conversation === undefined) {
      next(new ApiError(httpStatus.NOT_FOUND, 'Conversation not found'));
      return;
    }

    if (conversation.userId !== userId) {
      next(new ApiError(httpStatus.FORBIDDEN, 'Access forbidden'));
      return;
    }

    next();
  } catch (error) {
    next(new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to validate conversaton access'));
  }
};

import httpStatus from 'http-status';
import { Message, MessageType } from '@src/models/message.model';
import ApiError from '@src/utils/ApiError';

/**
 * creates a message with with an "N/A" rating
 */
export const createUserMessage = async (message: MessageType) => {
  return await Message.create(message);
};

/**
 * updates the rating on an exisiting message document
 */
export const rateUserMessage = async ({
  messageId,
  userId,
  rating,
}: {
  messageId: string;
  userId: string;
  rating: string;
}) => {
  if (!(await Message.canRateMessage(messageId, userId))) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to rate message');
  } else if (!(await Message.isMessageUnrated(messageId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Message already has rating');
  }

  return await Message.findByIdAndUpdate(messageId, { rating }, { runValidators: true });
};

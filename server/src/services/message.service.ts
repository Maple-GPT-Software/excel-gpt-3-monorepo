import httpStatus from 'http-status';
import { Message, MessageType } from '../models/message.model';
import ApiError from '../utils/ApiError';

/**
 * creates a message with with an "N/A" rating
 */
export const createUserMessage = async (message: MessageType) => {
  return Message.create(message);
};

/**
 * updates the rating on an exisiting message document
 */
export const rateUserMessage = async ({ id, userId, rating }: { id: string; userId: string; rating: string }) => {
  const message = await Message.findById(id);

  if (userId !== message?.userId) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Not authorized to rate message');
  } else if (message.rating !== '') {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Message already has rating');
  }

  return Message.findByIdAndUpdate(id, { rating }, { runValidators: true, new: true });
};

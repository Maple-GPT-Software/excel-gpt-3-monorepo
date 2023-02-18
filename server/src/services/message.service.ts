import httpStatus from 'http-status';
import { Message, MessageType } from '@src/models/message.model';
import ApiError from '@src/utils/ApiError';

export const createMessage = async (message: MessageType) => {
  return await Message.create(message);
};

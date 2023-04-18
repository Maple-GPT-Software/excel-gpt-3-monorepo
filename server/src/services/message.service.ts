import { CreateChatCompletionResponse, CreateCompletionResponseUsage } from 'openai';
import httpStatus from 'http-status';

import { DUserMessageObject, Message } from '../models/message.model';
import { DMessageBase, DMessageAuthor, PartialBy } from '../types';
import ApiError from '../utils/ApiError';

/**
 * creates a message with with an "N/A" rating
 */
export const createUserMessage = async (message: PartialBy<DMessageBase, 'author'>) => {
  return Message.create({ ...message, author: DMessageAuthor.USER });
};

export const createAssistantMessage = async (
  userMessage: DUserMessageObject,
  { model, message, usage }: { model: string; message: string; usage: CreateCompletionResponseUsage }
) => {
  const { prompt_tokens, completion_tokens, total_tokens } = usage;

  return Message.create({
    conversationId: userMessage.conversationId,
    userId: userMessage.userId,
    author: DMessageAuthor.ASSISTANT,
    content: message,
    source: userMessage.source,
    promptTokens: prompt_tokens,
    completionTokens: completion_tokens,
    totalTokens: total_tokens,
    model,
  });
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

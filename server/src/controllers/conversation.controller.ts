import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Conversation, DConversationDocument } from '../models/conversation.model';
import { DConversationPromptType } from '../types';
import { Message } from '../models/message.model';
import { SYSTEM_PROMPT_MAP } from '../constants';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';

export const getConversations = catchAsync(async (req: Request, res: Response) => {
  const { uid: userId } = req.decodedFirebaseToken;

  try {
    const conversations = await Conversation.find({ userId }).sort({ updatedAt: -1 });
    res.status(httpStatus.OK).send(conversations);
  } catch (error) {
    logger.error('conversation.controller > #getConversations', error, {
      userId,
    });
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Server error while loading your conversations');
  }
});

export const getConversationMessages = catchAsync(async (req: Request, res: Response) => {
  const { uid: userId } = req.decodedFirebaseToken;
  const { id: conversationId } = req.params;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Conversation does not exist');
    }

    if (conversation.userId !== userId) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You do not have access');
    }

    const messages = await Message.find({ conversationId }).sort().exec();

    res.status(httpStatus.OK).send(messages);
  } catch (error) {
    logger.error('conversation.controller  > #getConversationMessages', error, {
      userId,
      conversationId,
    });
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Server error retrieving messages');
  }
});

export const createConversation = catchAsync(async (req: Request, res: Response) => {
  const {
    promptType,
    temperature,
    source,
    name,
  }: { promptType: DConversationPromptType; temperature: number; source: string; name: string } = req.body;
  const { uid: userId } = req.decodedFirebaseToken;

  try {
    const conversation = await Conversation.create({
      userId,
      isBookmarked: false,
      name,
      systemPrompt: SYSTEM_PROMPT_MAP[promptType],
      promptType,
      temperature,
      source,
    });

    res.status(200).send(conversation);
  } catch (error) {
    logger.error('conversation.controller > #createConversation', error, {
      userId,
      source,
      promptType,
    });
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Server error while creating new conversation');
  }
});

export const deleteConversation = catchAsync(async (req: Request, res: Response) => {
  const { id: conversationId } = req.params;

  const conversation = await Conversation.findByIdAndDelete(conversationId, { returnDocument: 'before' });

  res.status(httpStatus.OK).send(conversation);
});

export const updateConversation = catchAsync(async (req: Request, res: Response) => {
  const {
    isBookmarked,
    name,
    temperature,
  }: { isBookmarked: boolean | undefined; name: string | undefined; temperature: number | undefined } = req.body;
  const { id: conversationId } = req.params;
  try {
    const conversationDoc = (await Conversation.findById(conversationId)) as DConversationDocument;

    if (isBookmarked !== undefined) {
      conversationDoc.isBookmarked = isBookmarked;
    }

    if (name !== undefined) {
      conversationDoc.name = name;
    }

    if (temperature !== undefined) {
      conversationDoc.temperature = temperature;
    }

    const updatedConversationDoc = await conversationDoc.save();

    res.status(httpStatus.OK).send(updatedConversationDoc);
  } catch (error) {
    logger.error('conversation.controller > #updateConversation', error, {
      conversationId,
    });
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Server while updating conversation');
  }
});

import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Conversation, DConversationDocument } from '../models/conversation.model';
import { DConversationPromptType } from '../types';
import { Message } from '../models/message.model';
import { SYSTEM_PROMPT_MAP } from '../constants';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

export const getConversations = catchAsync(async (req: Request, res: Response) => {
  const { uid: userId } = req.decodedFirebaseToken;

  try {
    // TOOD: sort conversation by updatedAt
    const conversations = await Conversation.find({ userId });
    res.status(httpStatus.OK).send(conversations);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'conversation.controller > #createConversationError: error while loading your conversations'
    );
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
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Internal server error');
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
      isSaved: false,
      name,
      systemPrompt: SYSTEM_PROMPT_MAP[promptType],
      promptType,
      temperature,
      source,
    });

    res.status(200).send(conversation);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'conversation.controller > #createConversationError: error while creating new conversation'
    );
  }
});

export const deleteConversation = catchAsync(async (req: Request, res: Response) => {
  const { id: conversationId } = req.params;

  const conversation = await Conversation.findByIdAndDelete(conversationId, { returnDocument: 'before' });

  res.status(httpStatus.OK).send(conversation);
});

export const updateConversation = catchAsync(async (req: Request, res: Response) => {
  const { isSaved, name }: { isSaved: boolean | undefined; name: string | undefined } = req.body;
  const { id: conversationId } = req.params;
  try {
    const conversationDoc = (await Conversation.findById(conversationId)) as DConversationDocument;

    if (isSaved !== undefined) {
      conversationDoc.isSaved = isSaved;
    }

    if (name !== undefined) {
      conversationDoc.name = name;
    }

    const updatedConversationDoc = await conversationDoc.save();

    res.status(httpStatus.OK).send(updatedConversationDoc);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'conversation.controller > #updateConversation: error while updating conversation'
    );
  }
});

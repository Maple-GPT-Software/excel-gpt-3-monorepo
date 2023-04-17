import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Conversation, DConversationDocument } from '../models/conversation.model';
import { SYSTEM_PROMPT_MAP } from '../constants';
import catchAsync from '../utils/catchAsync';
import ApiError from '../utils/ApiError';

export const createConversation = catchAsync(async (req: Request, res: Response) => {
  const {
    systemPromptKey,
    temperature,
    source,
  }: { systemPromptKey: keyof typeof SYSTEM_PROMPT_MAP; temperature: number; source: string } = req.body;
  const { uid: userId } = req.decodedFirebaseToken;

  try {
    const conversation = await Conversation.create({
      userId,
      isSaved: false,
      name: 'new conversation',
      systemPrompt: SYSTEM_PROMPT_MAP[systemPromptKey],
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

  await Conversation.findByIdAndDelete(conversationId);

  res.status(httpStatus.OK).send();
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

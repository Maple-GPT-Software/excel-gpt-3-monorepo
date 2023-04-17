import { Request, Response } from 'express';
import httpStatus from 'http-status';

import { Conversation } from '../models/conversation.model';
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
      name: 'new conversation',
      systemPrompt: SYSTEM_PROMPT_MAP[systemPromptKey],
      temperature,
      source,
    });

    res.status(200).send(conversation);
  } catch (error) {
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'conversation.controller > #createConversationError: while creating new conversation'
    );
  }
});

// export const deleteConversation = catchAsync(async (req: Request, res: Response) => {});

// export const updateConversation = catchAsync(async (req: Request, res: Response) => {});

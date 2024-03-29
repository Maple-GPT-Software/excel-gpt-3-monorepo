import { Response, Request } from 'express';
import httpStatus from 'http-status';

import * as messageService from '../services/message.service';
import * as openAIService from '../services/openai.service';
import catchAsync from '../utils/catchAsync';

export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const { prompt, source } = req.body;
  const { conversationId } = req.query;
  const userId = req.decodedFirebaseToken.uid;
  const { conversation } = req;

  const message = await messageService.createUserMessage({
    userId,
    conversationId: conversationId as string,
    content: prompt,
    source,
  });

  const aiCompletion = await openAIService.getChatCompletion(conversation, prompt);

  const aiMessage = await messageService.createAssistantMessage(message.toObject(), aiCompletion);

  res.send(aiMessage);
});

export const rateMessage = catchAsync(async (req: Request, res: Response) => {
  const { rating } = req.body;
  const userId = req.decodedFirebaseToken.uid;
  const { id } = req.params;

  await messageService.rateUserMessage({ id, userId, rating });
  res.status(httpStatus.ACCEPTED).send();
});

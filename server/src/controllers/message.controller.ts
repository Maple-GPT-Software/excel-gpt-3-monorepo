import { Response, Request } from 'express';
import httpStatus from 'http-status';

import * as messageService from '../services/message.service';
import * as openAIService from '../services/openai.service';
import catchAsync from '../utils/catchAsync';
import { DMessageRole } from '../types';

// TODO: 1) create user message in DB. 2) get completion. 3) create AI completion in DB
export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const { prompt, source } = req.body;
  const userId = req.decodedFirebaseToken.uid;

  const message = await messageService.createUserMessage({
    userId,
    role: DMessageRole.USER,
    content: prompt,
    source,
  });

  const completion: any = await openAIService.getChatCompletion(prompt, userId);

  res.send(message);
});

export const rateMessage = catchAsync(async (req: Request, res: Response) => {
  const { rating } = req.body;
  const userId = req.decodedFirebaseToken.uid;
  const { id } = req.params;

  await messageService.rateUserMessage({ id, userId, rating });
  res.status(httpStatus.ACCEPTED).send();
});

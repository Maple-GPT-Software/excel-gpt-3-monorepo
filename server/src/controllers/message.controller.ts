import { Response, Request } from 'express';

import httpStatus from 'http-status';

import catchAsync from '../utils/catchAsync';

import * as messageService from '../services/message.service';
import * as openAIService from '../services/openai.service';
import { BASE_PROMP_VERSION } from '../constants';

export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const { prompt, source } = req.body;
  const userId = req.decodedFirebaseToken.uid;

  const completion: any = await openAIService.getChatCompletion(prompt, userId);
  const message = await messageService.createUserMessage({
    userId,
    prompt,
    model: completion.model,
    completion: completion.choices[0].message.content ?? '',
    promptTokens: completion.usage?.prompt_tokens ?? 0,
    completionTokens: completion.usage?.completion_tokens ?? 0,
    totalTokens: completion.usage?.total_tokens ?? 0,
    source,
    promptVersion: BASE_PROMP_VERSION,
  });

  res.send(message);
});

export const rateMessage = catchAsync(async (req: Request, res: Response) => {
  const { rating } = req.body;
  const userId = req.decodedFirebaseToken.uid;
  const { id } = req.params;

  await messageService.rateUserMessage({ id, userId, rating });
  res.status(httpStatus.ACCEPTED).send();
});

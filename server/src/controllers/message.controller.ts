import { Response, Request } from 'express';

import httpStatus from 'http-status';
import catchAsync from '@src/utils/catchAsync';

import * as openAIService from '@src/services/openai.service';
import * as messageService from '@src/services/message.service';
import { BASE_PROMP_VERSION } from '@src/constants';

export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const { prompt, source } = req.body;
  const userId = req.decodedFirebaseToken.uid;

  const completion: any = await openAIService.getCompletion(prompt, userId);

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

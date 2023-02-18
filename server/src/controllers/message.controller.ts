import { Response, Request } from 'express';

import httpStatus from 'http-status';
import catchAsync from '@src/utils/catchAsync';
import ApiError from '@src/utils/ApiError';
import getCompletion from '../services/openai.service';
import { createMessage } from '../services/message.service';

export const createCompletion = catchAsync(async (req: Request, res: Response) => {
  const prompt = req.body.prompt;
  const userId = req.decodedFirebaseToken.uid;

  const completion = await getCompletion(prompt, userId);

  const message = await createMessage({
    userId,
    prompt,
    completion: completion.choices[0].text ?? '',
    promptTokens: completion.usage?.prompt_tokens ?? 0,
    completionTokens: completion.usage?.prompt_tokens ?? 0,
    totalTokens: completion.usage?.prompt_tokens ?? 0,
  });

  res.send(message);
});

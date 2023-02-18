import { Response, Request } from 'express';

import httpStatus from 'http-status';
import catchAsync from '@src/utils/catchAsync';
import ApiError from '@src/utils/ApiError';
import getCompletion from '../services/openai.service';

export const createCompletion = catchAsync(async (req: Request, res: Response) => {
  const prompt = req.body.prompt;
  const userId = req.decodedFirebaseToken.uid;

  const completion = await getCompletion(prompt, { userId });

  // TODO: save completion to API in openAI service

  res.send(completion);
});

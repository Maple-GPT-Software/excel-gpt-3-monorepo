import { Response, Request } from 'express';

import httpStatus from 'http-status';
import catchAsync from '@src/utils/catchAsync';
import ApiError from '@src/utils/ApiError';
import getCompletion from '@src/services/openai.service';
import * as messageService from '@src/services/message.service';

export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const prompt = req.body.prompt;
  const userId = req.decodedFirebaseToken.uid;

  try {
    const completion = await getCompletion(prompt, userId);

    const message = await messageService.createUserMessage({
      userId,
      prompt,
      model: completion.model,
      completion: completion.choices[0].text ?? '',
      promptTokens: completion.usage?.prompt_tokens ?? 0,
      completionTokens: completion.usage?.prompt_tokens ?? 0,
      totalTokens: completion.usage?.prompt_tokens ?? 0,
    });

    res.send(message);
  } catch (error) {
    console.error('#createMessage error', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Unable to answer question');
  }
});

export const rateMessage = catchAsync(async (req: Request, res: Response) => {
  const rating = req.body.rating;
  const userId = req.decodedFirebaseToken.uid;
  const { id } = req.params;

  try { 
    await messageService.rateUserMessage({ id, userId, rating });
    res.status(httpStatus.ACCEPTED).send();
  } catch (error) {
    console.error("messageController.rateMessage error", error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Rating failed. Try again.')
  }
});

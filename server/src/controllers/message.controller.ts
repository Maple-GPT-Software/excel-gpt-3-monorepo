import { Response, Request } from 'express';
import httpStatus from 'http-status';

import * as messageService from '../services/message.service';
import * as openAIService from '../services/openai.service';
import * as creditService from '../services/credit.service';
import { OpenAiModels } from '../config/openai';
import catchAsync from '../utils/catchAsync';

export const createMessage = catchAsync(async (req: Request, res: Response) => {
  const { prompt, source } = req.body;
  const { conversationId } = req.params;
  const userId = req.decodedFirebaseToken.uid;
  const { user } = req;

  const message = await messageService.createUserMessage({
    userId,
    conversationId,
    content: prompt,
    source,
  });

  const aiCompletion = await openAIService.getChatCompletion(prompt, userId);

  // only deduct credis from those that have purchased lifetime access
  if (user.stripeLifetimeAccessPaymentId !== '') {
    await creditService.deductCreditsByTokenUsage(
      userId,
      aiCompletion.usage.total_tokens,
      aiCompletion.model as OpenAiModels
    );
  }

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

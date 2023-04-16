import httpStatus from 'http-status';

import { OpenAiModels, modelCostPer1KTokens } from '../config/openai';
import { DUserDocument, User } from '../models/user.model';
import ApiError from '../utils/ApiError';
import server from '../index';

export const deductCreditsByTokenUsage = async (userId: string, tokensUsed: number, model: OpenAiModels) => {
  const user = (await User.findById(userId)) as DUserDocument;

  const { credits } = user;

  if (credits === 0 || credits === undefined) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Interval server error');
  }

  // case: openai changes their model naming
  if (modelCostPer1KTokens[model] === undefined) {
    // TODO: get notified of fatal error
    server.close(() => {
      process.exit(1);
    });
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, '#deductCreditByTokenUsage pricing for model does not exist');
  }

  let newCredits = credits - (tokensUsed / 1000) * modelCostPer1KTokens[model];

  if (newCredits < 0) {
    newCredits = 0;
  }

  user.credits = newCredits;

  await user.save();
};

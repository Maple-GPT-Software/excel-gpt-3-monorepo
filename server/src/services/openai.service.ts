import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { basePromptConfig } from '../config/openai';
import { BASE_PROMPT } from '../constants';
import logger from '../config/logger';
import { getOpenAiInstanceByUser } from './openaiCache.service';

/**
 * we to specify user this for abuse detection
 * https://platform.openai.com/docs/api-reference/completions/create#completions/create-user
 */
export async function getChatCompletion(prompt: string, user: string) {
  try {
    const openai = await getOpenAiInstanceByUser(user);
    // @ts-expect-error .createChatCompletion is a valid method, maintainers likely forgot to add it to types
    const { data } = await openai.createChatCompletion({
      ...basePromptConfig,
      user,
      messages: [
        {
          role: 'system',
          content: BASE_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    return data;
  } catch (error) {
    logger.http('#getCompletion ', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Interval server error');
  }
}

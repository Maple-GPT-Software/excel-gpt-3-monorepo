import ApiError from '@src/utils/ApiError';
import httpStatus from 'http-status';
import openai, { basePromptConfig } from '@src/config/openai';
import { BASE_PROMPT } from '@src/constants';
import logger from '@src/config/logger';

/**
 * we need this for abuse detection
 * https://platform.openai.com/docs/api-reference/completions/create#completions/create-user
 */
export async function getCompletion(prompt: string, user: string) {
  try {
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

import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { basePromptConfig } from '../config/openai';
import { BASE_PROMPT } from '../constants';
import logger from '../config/logger';
import { Configuration, OpenAIApi } from 'openai';
import config from '../config/config';

/**
 * we need this for abuse detection
 * https://platform.openai.com/docs/api-reference/completions/create#completions/create-user
 */
export async function getCompletion(prompt: string, user: string) {
  try {
    // TODO: use user's openai API key if it exists
    // caching openai instance?
    const configuration = new Configuration({
      apiKey: config.openAi,
      organization: 'org-WdaykyBMcZad17H1WbC3trTM',
    });

    const openai = new OpenAIApi(configuration);

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

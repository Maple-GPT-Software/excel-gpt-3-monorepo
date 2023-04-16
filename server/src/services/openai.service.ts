import httpStatus from 'http-status';

import { OpenAIApi } from 'openai';

import openai, { basePromptConfig } from '../config/openai';
import { BASE_PROMPT } from '../constants';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';

/**
 * we to specify user this for abuse detection
 * https://platform.openai.com/docs/api-reference/completions/create#completions/create-user
 */
export async function getChatCompletion(prompt: string, user: string) {
  try {
    const openaiInstance: OpenAIApi = openai;

    // FUTURE: if user has openaiApi key we can cache an instance of OpenAIApi with their key
    // const openai = await getOpenAiInstanceByUser(user);

    const {
      data: { model, choices, usage },
      // @ts-expect-error openai types not up to date
    } = await openaiInstance.createChatCompletion({
      ...basePromptConfig,
      user,
      // FUTURE: memory
      messages: [
        {
          role: 'system',
          // TODO: pass in conversation so that we can define temperature and system prompt
          content: BASE_PROMPT,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    if (!choices[0].message || !usage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Interval server error');
    }

    return {
      model,
      message: choices[0].message.content,
      usage,
    };
  } catch (error) {
    logger.http('#getCompletion ', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Interval server error');
  }
}

import ApiError from '@src/utils/ApiError';
import httpStatus from 'http-status';
import openai, { basePrompt } from '@src/config/openai';
import { BASE_PROMPT } from '@src/constants';
import logger from '@src/config/logger';

/**
 * we need this for abuse detection
 * https://platform.openai.com/docs/api-reference/completions/create#completions/create-user
 */
async function getCompletion(prompt: string, user: string) {
  //   console.log(JSON.stringify(`${BASE_PROMPT} ${prompt}`));
  try {
    const { data } = await openai.createCompletion({
      ...basePrompt,
      user,
      prompt: `${BASE_PROMPT} ${prompt}`,
    });

    return data;
  } catch (error) {
    console.log('openai error: ', JSON.stringify(error));
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Interval server error');
  }
}

export default getCompletion;

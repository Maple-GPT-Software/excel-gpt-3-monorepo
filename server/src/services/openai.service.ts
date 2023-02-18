import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';
import config from '@src/config/config';
import ApiError from '@src/utils/ApiError';
import httpStatus from 'http-status';
import { BASE_PROMPT } from '@src/constants';

interface CompletionOptions {
  /**
   * we need this for abuse detection
   * https://platform.openai.com/docs/api-reference/completions/create#completions/create-user
   */
  userId: string;
}

const configuration = new Configuration({
  apiKey: config.openai,
  organization: 'org-WdaykyBMcZad17H1WbC3trTM',
});

const openai = new OpenAIApi(configuration);

const baseCompletionConfig: CreateCompletionRequest = {
  model: 'text-davinci-003',
  max_tokens: 500,
  /**
   * between 0 and 2. Higher values like 0.8 will make the output more random,
   * while lower values like 0.2 will make it more focused and deterministic.
   * https://platform.openai.com/docs/api-reference/completions/create#completions/create-temperature
   */
  temperature: 0.4,
  // one completion per prompt
  n: 1,
};

async function getCompletion(prompt: string, options: CompletionOptions) {
  //   console.log(JSON.stringify(`${BASE_PROMPT} ${prompt}`));
  try {
    const completion = await openai.createCompletion({
      ...baseCompletionConfig,
      //   ...options,
      prompt: `${BASE_PROMPT} ${prompt}`,
    });

    return completion;
  } catch (error) {
    console.log('openai error: ', JSON.stringify(error));
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Interval server error');
  }
}

export default getCompletion;

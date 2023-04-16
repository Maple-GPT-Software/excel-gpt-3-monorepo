import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';

import config from './config';

export enum OpenAiModels {
  TURBO = 'gpt-3.5-turbo',
  TURBO_0301 = 'gpt-3.5-turbo-0301',
}

export const modelCostPer1KTokens: { [key in OpenAiModels]: number } = {
  [OpenAiModels.TURBO]: 0.002,
  [OpenAiModels.TURBO_0301]: 0.002,
};

const configuration = new Configuration({
  apiKey: config.openAi,
  organization: 'org-WdaykyBMcZad17H1WbC3trTM',
});

/** default openAI instance that uses our keys for trial users */
const openai = new OpenAIApi(configuration);

/**
 * base configuration. For testing use max_tokens: 50 and simple questions like
 * `How many moons does the earth have?`
 */
export const basePromptConfig: CreateCompletionRequest = {
  model: OpenAiModels.TURBO,
  max_tokens: 250,
  // one completion per prompt
  n: 1,
};

export default openai;

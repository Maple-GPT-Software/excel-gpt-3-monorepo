import { Configuration, CreateCompletionRequest, OpenAIApi } from 'openai';
import config from '@src/config/config';

export enum OpenAiModels {
  TURBO = "gpt-3.5-turbo",
  TURBO_0301 = "gpt-3.5-turbo-0301"
}

const configuration = new Configuration({
  apiKey: config.openAi,
  organization: 'org-WdaykyBMcZad17H1WbC3trTM',
});

const openai = new OpenAIApi(configuration);

/**
 * base configuration. For testing use max_tokens: 50 and simple questions like
 * `How many moons does the earth have?`
 */
export const basePromptConfig: CreateCompletionRequest = {
  model: "gpt-3.5-turbo",
  max_tokens: 500,
  /**
   * between 0 and 2. Higher values like 0.8 will make the output more random,
   * while lower values like 0.2 will make it more focused and deterministic.
   * https://platform.openai.com/docs/api-reference/completions/create#completions/create-temperature
   */
  temperature: 0.5,
  // one completion per prompt
  n: 1,
};

export default openai;

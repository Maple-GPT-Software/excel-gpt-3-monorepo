import { ChatCompletionRequestMessageRoleEnum, OpenAIApi } from 'openai';
import httpStatus from 'http-status';

import { DConversationObject } from '../models/conversation.model';
import openai, { basePromptConfig } from '../config/openai';
import { Message } from '../models/message.model';
import { SYSTEM_PROMPT_MAP } from '../constants';
import ApiError from '../utils/ApiError';
import logger from '../config/logger';

/**
 * we to specify user this for abuse detection
 * https://platform.openai.com/docs/api-reference/completions/create#completions/create-user
 */
export async function getChatCompletion(conversation: DConversationObject, prompt: string) {
  try {
    const openaiInstance: OpenAIApi = openai;

    // FUTURE: if user has openaiApi key we can cache an instance of OpenAIApi with their key
    // const openai = await getOpenAiInstanceByUser(user);

    const { temperature, systemPrompt, userId, _id } = conversation;

    const conversationHistory = await Message.find({ conversationId: _id.toString() })
      .sort({ createdAt: 'descending' })
      .limit(4)
      .lean()
      .exec();

    const chatMessages = conversationHistory.map((message) => {
      return {
        role:
          message.author === 'user'
            ? ChatCompletionRequestMessageRoleEnum.User
            : ChatCompletionRequestMessageRoleEnum.Assistant,
        content: message.content,
      };
    });

    const {
      data: { model, choices, usage },
      // @ts-expect-error openai types not up to date
    } = await openaiInstance.createChatCompletion({
      ...basePromptConfig,
      temperature,
      user: userId,
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...chatMessages,
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    if (!choices[0].message || !usage) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'openai.service > #getChatCompletion : Interval server error');
    }

    return {
      model,
      message: choices[0].message.content,
      usage,
    };
  } catch (error) {
    logger.http('#getCompletion ', error);
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'openai.service > #getChatCompletion : Interval server error');
  }
}

// TODO: rety comppletion

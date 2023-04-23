import settings from '../settings';
import { CompletionRating, GPTCompletion } from '../types';
import { AuthenticatedRequestor } from './requestors';

const SOURCE = 'APPSCRIPT';

export const enum SubscriptionStatuses {
  ACTIVE = 'active',
  TRIALING = 'trialing',
  PAST_DUE = 'past_due',
  CANCELED = 'canceled',
}

export interface SimplifyUserProfile {
  name: string;
  email: string;
  stripeCurrentPeriodEnd: number;
  stripeStatus: SubscriptionStatuses;
  userId: string;
}

/** =============== CONVERSATION TYPES */

export enum DConversationPromptType {
  googleSheetChat = 'googleSheetChat',
  googleAppScriptChat = 'googleAppScriptChat',
  generalAiChat = 'generalAiChat',
}

export interface DConversation {
  id: string;
  userId: string;
  isSaved: boolean;
  name: string;
  temperature: number;
  promptType: DConversationPromptType;
}

export interface NewConversation {
  name: string;
  promptType: DConversationPromptType;
  temperature: number;
}

/** =============== MESSAGE TYPES */

export enum DMessageAuthor {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export interface DMessageBase {
  author: DMessageAuthor;
  content: string;
  id: string;
}

export type DUserMessage = DMessageBase & {
  author: DMessageAuthor.USER;
};

export type DAssistantMessage = DMessageBase & {
  author: DMessageAuthor.ASSISTANT;
  rating: 'LIKE' | 'DISLIKE' | '';
};

const MESSAGE_BASE = 'message';
const CONVERSATION_BASE = 'conversation';

export default function SimplifyApi(accessToken: string): SimplifyApiClient {
  if (!accessToken) {
    throw new Error(`You can't make Simplify API calls when not logged in!`);
  }
  return new SimplifyApiClient(settings.simplifyBaseUrl, accessToken);
}

class SimplifyApiClient extends AuthenticatedRequestor {
  constructor(baseUrl: string, accessToken: string) {
    super(baseUrl, accessToken);
  }

  async getUserProfile(): Promise<SimplifyUserProfile> {
    const res = await this.post('/auth/login', {});

    if (res.status === 404) {
      throw new Error('Please create an account.');
    }

    return res.json();
  }

  // TODO: conversation ID
  async getCompletion(prompt: string): Promise<GPTCompletion> {
    const queryParams = new URLSearchParams({
      conversationId: '643e0517ac1a954843283dfc',
    });
    const response = await this.post(
      `/${MESSAGE_BASE}?${queryParams.toString()}`,
      {
        prompt,
        source: SOURCE,
      }
    );

    if (response.status === 500) {
      throw new Error('Unexpected Error. Please try again.');
    } else if (response.status === 403) {
      throw new Error('Your subscription has expired.');
    } else if (!response.ok) {
      throw new Error('Unexpected Error. Please try again.');
    }

    const completion = await response.json();

    return {
      ...completion,
      // back-end encodes special characters so that they aren't escaped by browser
      content: decodeURIComponent(completion.content).replaceAll('`', ''),
      status: 'success',
    };
  }

  async rateMessage(id: string, rating: CompletionRating): Promise<void> {
    const res = await this.patch(`/${MESSAGE_BASE}/rate/${id}`, { rating });

    if (res.status === 403) {
      throw new Error('You are not authorized to rate this message.');
    } else if (res.status === 400) {
      throw new Error('This message already has a rating.');
    }

    return;
  }

  async getConversations(): Promise<DConversation[]> {
    const res = await this.get(`/${CONVERSATION_BASE}`);

    return res.json();
  }

  async getConversationMessages(
    id: string
  ): Promise<(DAssistantMessage | DUserMessage)[]> {
    const res = await this.get(`/${CONVERSATION_BASE}/messages/${id}`);
    const messages = (await res.json()) as (DAssistantMessage | DUserMessage)[];

    if (messages.length === 0) {
      return [];
    }

    return messages.map((el) => ({
      ...el,
      content: decodeURIComponent(el.content).replaceAll('`', ''),
    }));
  }

  async createNewConversation({
    name,
    temperature,
    promptType,
  }: NewConversation): Promise<DConversation> {
    const res = await this.post(`/${CONVERSATION_BASE}`, {
      name,
      temperature,
      promptType,
      source: SOURCE,
    });

    return res.json();
  }

  async deleteConversation(id: string): Promise<DConversation> {
    const res = await this.delete(`/${CONVERSATION_BASE}/${id}`);

    return res.json();
  }
  // TODO: EDIT CONVERSATION
}

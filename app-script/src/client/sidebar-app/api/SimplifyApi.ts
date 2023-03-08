import { SIMPLIFY_BASE_URL } from '../settings';
import { CompletionRating, GPTCompletion } from '../types';
import { AuthenticatedRequestor } from './requestors';

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

const MESSAGE_BASE = 'message';

export default function SimplifyApi(accessToken: string): SimplifyApiClient {
  if (!accessToken) {
    throw new Error(`You can't make Simplify API calls when not logged in!`);
  }
  return new SimplifyApiClient(SIMPLIFY_BASE_URL, accessToken);
}

class SimplifyApiClient extends AuthenticatedRequestor {
  constructor(baseUrl: string, accessToken: string) {
    super(baseUrl, accessToken);
  }

  // TODO: AuthenticatedRequestor should return a raw response
  async getUserProfile(): Promise<SimplifyUserProfile> {
    const res = await this.post('/auth/login', {});

    if (res.status === 404) {
      throw new Error('Please create an account.');
    }

    return res.json();
  }

  async getCompletion(prompt: string): Promise<GPTCompletion> {
    const response = await this.post(`/${MESSAGE_BASE}`, { prompt });

    if (response.status === 500) {
      throw new Error('Unexpected Error. Please try again.');
    } else if (response.status === 403) {
      throw new Error('Your subscription has expired.');
    }

    const completion = await response.json();

    return {
      ...completion,
      // back-end encodes special characters so that they aren't escaped by browser
      message: decodeURI(completion.completion),
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
}

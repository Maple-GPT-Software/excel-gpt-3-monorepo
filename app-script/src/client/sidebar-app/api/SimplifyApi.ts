import { SIMPLIFY_BASE_URL } from '../settings';
import { AuthenticatedRequestor } from './requestors';

export enum Ratings {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

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

  async getUserProfile(): Promise<SimplifyUserProfile> {
    return await this.post('/auth/login', {});
  }

  async getCompletion(prompt: string) {
    const res = await this.post(`/${MESSAGE_BASE}`, { prompt });
    console.log(res);
  }

  async rateMessage(id: string, rating: Ratings) {
    const res = await this.patch(`/${MESSAGE_BASE}/rate/${id}`, { rating });
    console.log(res);
  }
}

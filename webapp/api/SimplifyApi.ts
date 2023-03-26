import { AuthenticatedRequestor } from './AuthenticatedRequestor';
import settings from '@/settings';
import type { SimplifyUser } from '@/types/simplifyApi';
import AuthService from '@/models/AuthService';
import { PriceIds } from '@/types/appTypes';

const SERVER_AUTH_BASE = '/auth';
const SERVER_PAYMENT_BASE = '/payment';
/**
 * This function returns an AuthenticatedRequestor. It can be used in or outside of React. Outside of react the function will reach out
 * to AuthService to get the access token for the currently logged in user
 */
export default function SimplifyApi(accessToken?: string): SimplifyApiClient {
  let token: string | undefined;

  if (accessToken !== undefined) {
    token = accessToken;
  } else {
    token = AuthService.accessToken ?? '';
  }

  if (token === undefined) {
    throw new Error('You need to be authenticated by Firebase make SimplifyApi API calls');
  }

  return new SimplifyApiClient(new AuthenticatedRequestor(settings.simplifyBaseUrl, token));
}

class SimplifyApiClient {
  private readonly requestor: AuthenticatedRequestor;
  constructor(requestor: AuthenticatedRequestor) {
    this.requestor = requestor;
  }

  async createUser(name: string, hasAcceptedTerms: boolean, referrer?: string) {
    try {
      const res = await this.requestor.post<SimplifyUser>({
        url: `${SERVER_AUTH_BASE}/signup`,
        data: { name, hasAcceptedTerms, referrer },
      });

      return res.data;
    } catch (error) {
      console.error('Error creating user');
      throw error;
    }
  }

  async createFreeSubscription() {
    return await this.requestor.post({ url: `${SERVER_PAYMENT_BASE}/trial` });
  }

  async createCheckoutSession(data: { priceId: PriceIds; openaiApiKey: string; successUrl: string; cancelUrl: string }) {
    // eslint-disable-next-line no-useless-catch
    try {
      const response = await this.requestor.post<any>({
        url: `${SERVER_PAYMENT_BASE}/checkout-session`,
        data,
      });

      return response.data;
    } catch (error: any) {
      // stripe sends 307 for re-direct
      if (error?.response?.status === 307) {
        return window.open(error.response.data.url, '_self');
      } else {
        throw error;
      }
    }
  }

  async lifetimeAccessCheckout(data: { openaiApiKey: string; successUrl: string; cancelUrl: string }) {
    // eslint-disable-next-line no-useless-catch
    try {
      await this.requestor.post<any>({
        url: `${SERVER_PAYMENT_BASE}/lifetime-checkout`,
        data: {
          ...data,
          priceId: PriceIds.LIFETIME_CHAT_ACCESS,
        },
      });
    } catch (error: any) {
      // stripe sends 307 for re-direct
      if (error?.response?.status === 307) {
        return window.open(error.response.data.url, '_self');
      } else {
        throw error;
      }
    }
  }

  async login() {
    const response = await this.requestor.post<SimplifyUser>({
      url: `${SERVER_AUTH_BASE}/login`,
    });

    return response.data;
  }
}

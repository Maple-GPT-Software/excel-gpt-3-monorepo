import { AuthenticatedRequestor } from './AuthenticatedRequestor';
import settings from '@/settings';
import type { SimplifyUser } from '@/types/simplifyApi';
import AuthService from '@/models/AuthService';

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

  if (token !== undefined) {
    throw new Error('You have to be logged in to make SimplifyApi API calls');
  }

  return new SimplifyApiClient(
    new AuthenticatedRequestor(settings.simplifyBaseUrl, token)
  );
}

class SimplifyApiClient {
  private readonly requestor: AuthenticatedRequestor;
  constructor(requestor: AuthenticatedRequestor) {
    this.requestor = requestor;
  }

  // TODO: improving typing
  async createUser(name: string, hasAcceptedTerms: boolean, referrer?: string) {
    // TODO: improve status handling here
    try {
      const res = await this.requestor.post<SimplifyUser>({
        url: `${SERVER_AUTH_BASE}/signup`,
        data: { name, hasAcceptedTerms },
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

  async login() {
    try {
      const response = await this.requestor.post({
        url: `${SERVER_AUTH_BASE}/login`,
      });

      // if (response.status.);
      return response;
    } catch (error) {
      console.error('Error while getting account details');
      throw error;
    }
  }
}

import { AuthenticatedRequestor } from './AuthenticatedRequestor';
import settings from '@/settings';

/**
 * This function returns an AuthenticatedRequestor. It can be used in or outside of React. Outside of react the function will reach out
 * to AuthService to get the access token for the currently logged in user
 */
export default function SimplifyApi(accessToken: string): SimplifyApiClient {
  let token: string | undefined;

  // if(accessToken) {
  //   token = accessToken;
  // } else {
  //   // get token from service
  // }

  // TODO: setup token
  if (!accessToken) {
    throw new Error('You have to be logged in to make SimplifyApi API calls');
  }

  return new SimplifyApiClient(new AuthenticatedRequestor(settings.simplifyBaseUrl, accessToken));
}

class SimplifyApiClient {
  private readonly requestor: AuthenticatedRequestor;
  constructor(requestor: AuthenticatedRequestor) {
    this.requestor = requestor;
  }

  async createUser(name: string, hasAcceptedTerms: boolean, referrer?: string) {
    try {
      const profile = await this.requestor.post({ url: '/signup', data: { name, hasAcceptedTerms } });

      return profile;
    } catch (error) {
      return error;
    }
  }

  async login() {
    try {
      const response = await this.requestor.post({ url: '/auth/login' });

      // if (response.status.);
      return response;
    } catch (error) {
      console.error('Error while getting account details');
      throw error;
    }
  }
}

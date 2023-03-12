import { AbstractRequestor } from './AbstractRequestor';

export class AuthenticatedRequestor extends AbstractRequestor {
  /**
   * @param baseURL | https://api.excelsimplify.com
   * @param authToken | firebase access token
   */
  constructor(baseURL: string, accessToken: string) {
    const headers: { Authorization: string } = {
      Authorization: `Access ${accessToken}`,
    };

    // additional headers

    super({ baseURL, headers });
  }
}

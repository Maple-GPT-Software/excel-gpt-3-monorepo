import { AbstractRequestor } from "./AbstractRequestor";

export class AuthenticatedRequestor extends AbstractRequestor {
  // TODO: request timeout???
  constructor(baseURL: string, authToken: string) {
    const headers = {
      Authorization: `Beader ${authToken}`,
    };

    super({
      baseURL,
      headers,
    });
  }
}

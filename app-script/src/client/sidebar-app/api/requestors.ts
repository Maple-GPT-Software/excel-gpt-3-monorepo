export class AuthenticatedRequestor {
  private baseUrl: string;
  private accessToken: string;

  constructor(baseUrl: string, accessToken: string) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  async get(endpoint: string) {
    const url = this.baseUrl + endpoint;
    return await fetch(url, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }

  async post(endpoint: string, body: any) {
    const url = this.baseUrl + endpoint;
    return await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(body),
    });
  }

  async patch(endpoint: string, body: any) {
    const url = this.baseUrl + endpoint;
    return await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
      body: JSON.stringify(body),
    });
  }

  async delete(endpoint: string) {
    const url = this.baseUrl + endpoint;

    return await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.accessToken}`,
      },
    });
  }
}

import axios from 'axios';
import type { AxiosInstance, AxiosRequestConfig } from 'axios';

/** search params, e.g ?id=some_id */
interface RequestParams {
  [k: string]: string | number | undefined;
}

interface RequestHeaders {
  [key: string]: any;
}

export class AbstractRequestor {
  private readonly baseUrl: string | undefined;
  private readonly instance: AxiosInstance;

  constructor(config: AxiosRequestConfig) {
    this.instance = axios.create(config);
    this.baseUrl = config.baseURL;
  }

  async get<T>({
    url,
    params,
    headers,
  }: {
    url: string;
    params?: RequestParams;
    headers?: RequestHeaders;
  }) {
    return await this.instance.get<T>(url, { params, headers });
  }

  async post<T>({
    url,
    data,
    params,
    headers,
  }: {
    url: string;
    data?: unknown;
    params?: RequestParams;
    headers?: RequestHeaders;
  }) {
    return await this.instance.post<T>(url, data, { params, headers });
  }

  async patch<T>({
    url,
    data,
    headers,
  }: {
    url: string;
    data?: unknown;
    headers?: RequestHeaders;
  }) {
    return await this.instance.patch<T>(url, data, { headers });
  }

  async delete<T>({
    url,
    headers,
  }: {
    url: string;
    data?: unknown;
    headers?: RequestHeaders;
  }) {
    return await this.instance.delete<T>(url, { headers });
  }
}

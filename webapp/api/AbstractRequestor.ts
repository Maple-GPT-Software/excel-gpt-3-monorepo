import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

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

  get<T>({ url, params, headers }: { url: string; params?: RequestParams; headers?: RequestHeaders }) {
    return this.instance.get<T>(url, { params, headers });
  }

  post<T>({
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
    return this.instance.post<T>(url, data, { params, headers });
  }

  patch<T>({ url, data, headers }: { url: string; data?: unknown; headers?: RequestHeaders }) {
    return this.instance.patch<T>(url, data, { headers });
  }

  delete<T>({ url, data, headers }: { url: string; data?: unknown; headers?: RequestHeaders }) {
    return this.instance.delete<T>(url, { headers });
  }
}

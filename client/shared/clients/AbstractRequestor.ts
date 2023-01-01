import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";

interface Params {
  [k: string]: string | number | undefined;
}

interface Headers {
  [k: string]: any;
}

/**
 * Specifies interface for AbstractRequestor
 */
interface Requestor {
  get<T>({
    url,
    params,
  }: // expires,
  {
    url: string;
    params?: Params;
    // expires?: number;
  }): Promise<AxiosResponse<T, any>>;
  post<T>({
    url,
    data,
  }: {
    url: string;
    data?: unknown;
  }): Promise<AxiosResponse<T, any>>;
  // patch<T>({ url, data }: { url: string; data?: unknown }): Promise<T>;
  // put<T>({ url, data }: { url: string; data?: unknown }): Promise<T>;
  // delete<T>({ url, data }: { url: string; data?: unknown }): Promise<T>;
}

type RequestMethod = NonNullable<AxiosRequestConfig["method"]>;

/**
 * Config for axios requests
 */
interface RequestConfig {
  method: RequestMethod;
  url: string;
  headers?: Headers;
  params?: Params;
  data?: any;
}

export abstract class AbstractRequestor implements Requestor {
  private readonly instance: AxiosInstance;
  private readonly baseUrl: string;

  constructor(axiosConfig: AxiosRequestConfig) {
    this.instance = axios.create(axiosConfig);
  }

  get<T>({
    url,
    params,
    headers,
  }: {
    url: string;
    params?: Params;
    headers?: Headers;
  }) {
    const config: RequestConfig = {
      method: "GET",
      url,
      params,
      headers,
    };
    return this._request_<T>(config);
  }

  post<T>({
    url,
    data,
    headers,
  }: {
    url: string;
    data?: unknown;
    headers?: Headers;
  }) {
    const config: RequestConfig = { method: "POST", url, data, headers };
    return this._request_<T>(config);
  }

  protected async _request_<T>(config: RequestConfig) {
    // TO_IMPLEMENT: analytics logging to mixpanel??? can be done with axios interceptors

    return this.instance.request<T>(config);
  }
}

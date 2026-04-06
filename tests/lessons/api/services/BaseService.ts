import { APIRequestContext, APIResponse } from '@playwright/test';
import { ok } from 'node:assert';

export interface RequestOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number>;
  multipart?: Record<string, any>;
  baseURL?: string;
}

export class BaseService {
  protected request: APIRequestContext;

  protected authToken: string | null = null;

  constructor(request: APIRequestContext, authToken?: string) {
    this.request = request;
    this.authToken = authToken || null;
  }

  setAuthToken(token: string): void {
    this.authToken = token;
  }

  protected getDefaultHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  protected mergeHeaders(customHeaders?: Record<string, string>): Record<string, string> {
    return {
      ...this.getDefaultHeaders(),
      ...customHeaders,
    };
  }

  //   get<Post>
  //   get<Products>
  //   get<Products[]>

  async get<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    const response = await this.request.get(endpoint, {
      headers: this.mergeHeaders(options?.headers),
      params: options?.params,
    });
    return this.parseResponse<T>(response);
  }

  private async parseResponse<T>(response: APIResponse): Promise<T> {
    return response.json();
  }

  async post<T, D>(endpoint: string, data?: D, options?: RequestOptions): Promise<T> {

    const url = options?.baseURL ? `${options.baseURL}${endpoint}` : endpoint;

    const response = await this.request.post(url, {
      data: options?.multipart ? undefined : data,
      multipart: options?.multipart,
      headers: this.mergeHeaders(options?.headers),
    });
    return this.parseResponse<T>(response);
  }

  async put<T,D>(endpoint: string, data: D, option?: RequestOptions): Promise<T>{
    const response = await this.request.put(endpoint, {
      data,
      headers: this.mergeHeaders(option?.headers)
    })
    return this.parseResponse<T>(response)
  }

  async patch<T,D>(endpoint: string, data: D, option?: RequestOptions): Promise<T>{
    const response = await this.request.patch(endpoint, {
      data,
      headers: this.mergeHeaders(option?.headers)
    })
    return this.parseResponse<T>(response)
  }

  async delete(endpoint: string, option?: RequestOptions): Promise<void>{
    const reponse = await this.request.delete(endpoint, {
      headers: this.mergeHeaders(option?.headers)
    })
    if(!reponse.ok()){
      throw new Error(`DELETE FAILED: ${reponse.status()}`)
    }
  }

  //PostRaw dùng riêng cho phần đăng nhập
  async postRaw<D>(endpoint: string, data: D, option?: RequestOptions): Promise<APIResponse> {
    return this.request.post(endpoint, {
      data,
      headers: option?.headers
    })
  }

}
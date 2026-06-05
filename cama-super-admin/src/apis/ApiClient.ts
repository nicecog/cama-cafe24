import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiResponseError {
  code: number;
  message: string;
  status: number;
}

export interface ApiResponsePagination {
  totalCount: number; // 전체 데이터 길이
  totalPage: number;
  currentPage: number;
  displayRow: number; // rows per page

  startNum: number;
  endNum: number;
  displayPage: number;
  beginPage: number;
  endPage: number;
  prevPage: number;
  nextPage: number;
}

export interface ApiResponse<T = any> {
  error: ApiResponseError | null;
  success: boolean;
  response: T | null;
  pagination: ApiResponsePagination | null;
}

class ApiClient {
  public apiToken: string;

  public axiosInstance: AxiosInstance;

  constructor(apiToken?: string, config?: AxiosRequestConfig) {
    this.apiToken = apiToken || '';
    this.axiosInstance = axios.create({
      baseURL:
        process.env.REACT_APP_API_URL?.replace(/\/+$/, '') ||
        'https://camaplus.cafe24.com',
      timeout: 10000,
      withCredentials: true,
      ...config,
    });

    this.axiosInstance.interceptors.request.use(
      (requestConfig) => this.onRequestFulfilled(requestConfig),
      (error) => this.onRequestRejected(error),
    );

    this.axiosInstance.interceptors.response.use(
      (response) => this.onResponseFulfilled(response),
      (error) => this.onResponseRejected(error),
    );
  }

  private onRequestFulfilled(config: AxiosRequestConfig) {
    if (this.apiToken && config.headers) {
      config.headers.api_key = `Bearer ${this.apiToken}`;
    }

    return config;
  }

  private onRequestRejected(error: Error | AxiosError<ApiResponse>) {
    return error;
  }

  private onResponseFulfilled(response: AxiosResponse<ApiResponse>) {
    return response;
  }

  private onResponseRejected(error: AxiosError<ApiResponse>) {
    if (error instanceof axios.Cancel) return Promise.reject(error);

    const { response } = error;
    const status = response?.data.error?.status ?? response?.status;
    const message = response?.data?.error?.message || error.message;

    error.name = 'RequestError';
    error.message = message;
    error.status = status ?? 520;

    return Promise.reject(error);
  }

  get<T>(endpoint: string, params?: any, options?: AxiosRequestConfig) {
    return this.axiosInstance.get<ApiResponse<T>>(endpoint, { params, ...options }).then((response) => response.data);
  }

  post<T>(endpoint: string, data?: any, options?: AxiosRequestConfig) {
    return this.axiosInstance.post<ApiResponse<T>>(endpoint, data, options).then((response) => response.data);
  }

  put<T>(endpoint: string, data?: any, options?: AxiosRequestConfig) {
    return this.axiosInstance.put<ApiResponse<T>>(endpoint, data, options).then((response) => response.data);
  }

  delete<T>(endpoint: string, params?: any) {
    return this.axiosInstance.delete<ApiResponse<T>>(endpoint, { params }).then((response) => response.data);
  }
}

export default new ApiClient();

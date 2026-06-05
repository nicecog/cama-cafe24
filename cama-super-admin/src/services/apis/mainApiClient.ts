import axios, {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

import { getTokenLocalStorage } from "../../storages/tokenStorage";

export interface Pagination {
  beginPage: number;
  currentPage: number;
  displayPage: number;
  displayRow: number;
  endNum: number;
  endPage: number;
  nextPage: number;
  prevPage: number;
  startNum: number;
  totalCount: number;
  totalPage: number;
}

interface IResponseError {
  code: number;
  message: string;
  status: number;
}

interface ICustomResponse<T = any> {
  error?: IResponseError;
  pagination: Pagination | null;
  response?: T;
  success: boolean;
}

interface ICustomAxiosInstance extends AxiosInstance {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse<ICustomResponse>>;
  };
  getUri(config?: AxiosRequestConfig): string;
  request<T>(config: AxiosRequestConfig): Promise<T>;
  get<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  head<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  options<T>(url: string, config?: AxiosRequestConfig): Promise<T>;
  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
  patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>;
}

const DEFAULT_CAFE24_API = "https://camaplus.cafe24.com";

function resolveApiBaseUrl(): string {
  const fromEnv = process.env.REACT_APP_API_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/+$/, "");
  }
  if (process.env.REACT_APP_PROFILE === "cafe24") {
    return DEFAULT_CAFE24_API;
  }
  return DEFAULT_CAFE24_API;
}

/** Cafe24 VPS API (nginx → cama-plus-server:8080) */
export const stageInfo = {
  baseURL: resolveApiBaseUrl(),
  name:
    process.env.REACT_APP_PROFILE === "cafe24" ? "(Cafe24)" : "(Cafe24 default)",
};

const mainApiClient: ICustomAxiosInstance = axios.create({
  baseURL: stageInfo.baseURL,
});

mainApiClient.interceptors.request.use(async (request: AxiosRequestConfig) => {
  const token = await getTokenLocalStorage();
  if (token !== null) {
    request.headers = { ["api_key"]: `Bearer ${token}` };
  }
  return request;
});

mainApiClient.interceptors.response.use(
  (res) => {
    const { response, error, pagination } = res.data;
    if (error) {
      return Promise.reject(JSON.stringify(error, null, 2));
    }
    if (pagination === null) {
      return response;
    }
    return { data: response, pagination };
  },
  (error: AxiosError<ICustomResponse>) => {
    if (error?.response?.data?.error?.message) {
      return Promise.reject(error?.response?.data?.error?.message);
    }
    return Promise.reject(`Network Error. \n code: ${error?.response?.status}`);
  }
);

export default mainApiClient;

import axios, {
  AxiosInstance,
  AxiosInterceptorManager,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from 'axios';

import {
  currentStage,
  resolveAdminUrl,
  resolveApiBaseUrl,
} from '@/config/stage';
import { getTokenEncryptedStorage } from '@/storages/tokenStorage';

interface ResponseError {
  message: string;
  status: number;
}

interface CustomResponse<T = any> {
  error?: ResponseError;
  response?: T;
  success: boolean;
}

interface ICustomAxiosInstance extends AxiosInstance {
  interceptors: {
    request: AxiosInterceptorManager<AxiosRequestConfig>;
    response: AxiosInterceptorManager<AxiosResponse<CustomResponse>>;
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

export { currentStage } from '@/config/stage';

export const adminUrl = resolveAdminUrl(currentStage);

const mainApiClient: ICustomAxiosInstance = axios.create({
  baseURL: resolveApiBaseUrl(currentStage),
  timeout: 30000,
});

if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log('[cama-api] stage=', currentStage, 'baseURL=', mainApiClient.defaults.baseURL);
}

const PUBLIC_PATIENT_AUTH_PREFIX = '/api/public/patient/';

mainApiClient.interceptors.request.use(async (request: AxiosRequestConfig) => {
  const url = request.url ?? '';
  const isPublicPatientAuth =
    url.startsWith(PUBLIC_PATIENT_AUTH_PREFIX) ||
    url.includes('/api/public/patient/');

  const token = await getTokenEncryptedStorage();
  request.headers = {
    ...request.headers,
    ...(token && !isPublicPatientAuth
      ? { api_key: `Bearer ${token}` }
      : {}),
  };
  return request;
});

mainApiClient.interceptors.response.use(
  res => {
    const { response, error } = res.data;

    if (error) {
      return Promise.reject(JSON.stringify(error, null, 2));
    } else {
      return response;
    }
  },
  (error: AxiosError<CustomResponse>) => {
    const apiMessage = error?.response?.data?.error?.message;
    if (apiMessage) {
      return Promise.reject(apiMessage);
    }
    const status = error?.response?.status;
    if (status) {
      return Promise.reject(
        `요청 처리 중 오류가 발생했습니다. (HTTP ${status})`,
      );
    }
    return Promise.reject('네트워크 연결을 확인해 주세요.');
  },
);

export default mainApiClient;

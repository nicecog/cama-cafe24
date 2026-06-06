import intance from "axios";
import { AxiosResponse } from "axios";
// import { getCookie } from "@/hooks/useAuth";
// Query Type
export type ApiResponse<T> = {
  status: string;
  message: null;
  data: {
    [key: string]: T[];
  };
  errorCode: null;
  errorMessageList: null;
};

// Default Config
const config = {
  baseURL: import.meta.env.DEV ? "/" : import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-type": "application/json",
  },
  withCredentials: true,
};

const axios = intance.create(config);

// 요청 인터셉터
axios.interceptors.request.use(
  function (config) {
    const apikey = localStorage.getItem(
      import.meta.env.VITE_COOKIE_ACCESS_TOKKEN
    );

    // const apikey = getCookie(import.meta.env.VITE_COOKIE_ACCESS_TOKKEN);

    if (apikey) {
      const bearer = `Bearer ${apikey}`;
      config.headers["api_key"] = bearer;
      // Cafe24 front may strip api_key (underscore)
      config.headers["Authorization"] = bearer;
    }

    // 1. 요청 전달되기 전 작업 처리
    // config를 설정할 수 있다
    return config;
  },
  (error) => {
    // 2. 요청 에러가 있는 작업 처리
    return Promise.reject(error);
  }
);

// 응답 인터셉터
axios.interceptors.response.use(
  function (response) {
    // 응답 200번대 status일 때 응답 성공 직전 호출
    // 3. 이 작업 이후 .then()으로 이어진다
    return response;
  },
  (error) => {
    console.log(error);

    // 응답 200번대가 아닌 status일 때 응답 에러 직전 호출
    // 4. 이 작업 이후 .catch()로 이어진다
    return Promise.reject(error);
  }
);

// axios Promise 생성
export const createAxios = async <T,>(
  url: string,
  param?: Record<string, any>,
  callback?: (data: any) => void
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axios.post(url, param);
    if (callback) {
      // Callback 이 있으면 수행함
      callback(response.data);
    }
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default axios;

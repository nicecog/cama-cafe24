import { getDefaultStore } from "jotai";
import ky, { type Options } from "ky";
import { isLoadingCountAtom } from "@/atoms/CommonAtoms";
import { currentStage, resolveApiBaseUrl } from "@/config/stage";

// Jotai store
const store = getDefaultStore();

const API_BASE_URL = import.meta.env.DEV
  ? window.location.origin
  : import.meta.env.VITE_API_SERVER || resolveApiBaseUrl(currentStage);

// Ky 기본 설정
const defaultConfig: Options = {
  prefixUrl: API_BASE_URL,
  headers: {
    accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 2 * 60 * 1000, // 2분
  credentials: "include", // withCredentials 대체
  hooks: {
    beforeRequest: [
      (request) => {
        store.set(isLoadingCountAtom, (count) => count + 1);
        return request;
      },
    ],
    afterResponse: [
      (_request, _options, response) => {
        store.set(isLoadingCountAtom, (count) => count - 1);
        return response;
      },
    ],
    beforeError: [
      (error) => {
        // 응답 에러 시에도 카운트 감소
        store.set(isLoadingCountAtom, (count) => count - 1);
        return error;
      },
    ],
  },
};

// 전역적으로 사용할 Ky 클라이언트 생성
export const apiClient = ky.create(defaultConfig);

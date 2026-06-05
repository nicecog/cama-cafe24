import ky, { type KyInstance } from "ky";
import { currentStage, resolveApiBaseUrl } from "@/config/stage";
import { setupInterceptors } from "./interceptors";

const API_BASE_URL =
  import.meta.env.VITE_API_SERVER || resolveApiBaseUrl(currentStage);

/**
 * 기본 ky 인스턴스
 * - 모든 API 요청에 사용되는 기본 HTTP 클라이언트
 * - 자동으로 JSON 변환 및 에러 핸들링
 * - retry는 React Query 레벨에서만 처리 (중복 방지)
 */
export const apiClient: KyInstance = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000, // 30초
  retry: {
    limit: 0, // HTTP 클라이언트 레벨에서는 재시도 안 함 (React Query에서 처리)
    methods: ["get"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
  hooks: {
    beforeRequest: [],
    afterResponse: [],
    beforeError: [],
  },
});

/**
 * 인터셉터가 적용된 API 클라이언트
 */
export const api = setupInterceptors(apiClient);

/**
 * 인증이 필요 없는 공개 API용 클라이언트
 */
export const publicApi: KyInstance = ky.create({
  prefixUrl: API_BASE_URL,
  timeout: 30000,
  retry: {
    limit: 0, // HTTP 클라이언트 레벨에서는 재시도 안 함
    methods: ["get"],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
});

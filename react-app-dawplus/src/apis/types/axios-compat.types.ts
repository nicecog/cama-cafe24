/**
 * Axios 스타일 응답 타입
 * 기존 Axios API와 호환되는 응답 구조
 */

/**
 * API 응답 에러 타입
 */
export interface ResponseError {
  message: string;
  status: number;
}

/**
 * Axios 스타일 커스텀 응답 타입
 * - success: 요청 성공 여부
 * - response: 실제 응답 데이터 (성공 시)
 * - error: 에러 정보 (실패 시)
 */
export interface CustomResponse<T = any> {
  success: boolean;
  response?: T;
  error?: ResponseError;
}

/**
 * Stage 타입 (개발/프로덕션)
 */
export type Stage = "DEV" | "PROD";

/**
 * Stage별 Base URL 매핑
 */
export type StageBaseUrl = {
  [stage in Stage]: string;
};

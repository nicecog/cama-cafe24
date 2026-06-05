import type { HTTPError, KyInstance, NormalizedOptions } from "ky";
import { getTokenEncryptedStorage } from "@/lib/encryptedStorage";

/**
 * 암호화된 스토리지에서 인증 토큰 가져오기
 * 개발 환경에서는 VITE_DEV_TEST_TOKEN을 우선 사용
 */
const getAuthToken = async (): Promise<string | null> => {
  try {
    // 개발 환경에서 테스트 토큰이 있으면 우선 사용
    if (import.meta.env.DEV && import.meta.env.VITE_DEV_TEST_TOKEN) {
      //console.log("🔑 Using DEV test token");
      return import.meta.env.VITE_DEV_TEST_TOKEN;
    }

    // 일반적인 경우: 암호화된 스토리지에서 토큰 가져오기
    const token = await getTokenEncryptedStorage();
    return token;
  } catch {
    return null;
  }
};

/**
 * 요청 전 인터셉터
 * - api_key 헤더 자동 추가 (Bearer 토큰)
 * - Authorization 헤더도 함께 추가 (호환성)
 */
const beforeRequestInterceptor = async (
  request: Request,
  _options: NormalizedOptions,
) => {
  const token = await getAuthToken();

  if (token) {
    // api_key 헤더 추가 (기존 Axios 방식)
    request.headers.set("api_key", `Bearer ${token}`);
    // Authorization 헤더도 추가 (표준 방식)
    // request.headers.set("Authorization", `Bearer ${token}`);
  }

  // 기본 헤더 설정
  request.headers.set("Content-Type", "application/json");
  request.headers.set("Accept", "application/json");
};

/**
 * 응답 후 인터셉터
 * - 성공 응답 로깅 (개발 환경)
 * - Axios 스타일 응답 처리 (success/error 구조)
 */
const afterResponseInterceptor = async (
  _request: Request,
  _options: NormalizedOptions,
  response: Response,
) => {
  if (import.meta.env.DEV) {
    // console.log(`✅ ${request.method} ${request.url}`, {
    // 	status: response.status,
    // 	statusText: response.statusText,
    // });
  }

  // Axios 스타일 응답 처리
  // response.data 구조: { success: boolean, response?: T, error?: { message, status } }
  try {
    const clonedResponse = response.clone();
    const data = await clonedResponse.json();

    // error가 있으면 에러로 처리
    if (data.error) {
      const error = new Error(data.error.message || "API Error");
      (error as any).status = data.error.status;
      (error as any).response = response;
      throw error;
    }

    // success가 false면 에러로 처리
    if (data.success === false && !data.response) {
      const error = new Error("Request failed");
      (error as any).response = response;
      throw error;
    }
  } catch (error) {
    // JSON 파싱 실패 또는 에러 발생 시
    // 원본 response를 그대로 반환하거나 에러를 던짐
    if (error instanceof Error && (error as any).response) {
      throw error;
    }
    // JSON 파싱 실패는 무시하고 원본 response 반환
  }

  return response;
};

/**
 * 에러 인터셉터
 * - 401: 인증 만료 처리
 * - 403: 권한 없음 처리
 * - Axios 스타일 에러 처리
 */
const beforeErrorInterceptor = async (error: HTTPError) => {
  const { request, response } = error;

  // 에러 로깅 (개발 환경)
  if (import.meta.env.DEV) {
    console.error(`❌ ${request.method} ${request.url}`, {
      status: response.status,
      statusText: response.statusText,
    });
  }

  // 401: 인증 만료
  if (response.status === 401) {
    const { removeTokenEncryptedStorage } = await import(
      "@/lib/encryptedStorage"
    );
    await removeTokenEncryptedStorage();
    // 로그인 페이지로 리다이렉트
    const loginPage = import.meta.env.VITE_LOGIN_PAGE || "/login";
    if (window.location.pathname !== loginPage) {
      window.location.href = loginPage;
    }
  }

  // 403: 권한 없음
  if (response.status === 403) {
    console.warn("접근 권한이 없습니다.");
  }

  // Axios 스타일 에러 메시지 파싱
  try {
    const errorData = (await response.json()) as {
      error?: { message?: string; status?: number };
      message?: string;
    };

    // error.message 우선 사용
    if (errorData.error?.message) {
      error.message = errorData.error.message;
    } else if (errorData.message) {
      error.message = errorData.message;
    }
  } catch {
    // JSON 파싱 실패 시 Network Error 메시지
    if (!error.message || error.message === "HTTPError") {
      error.message = `Network Error. \ncode: ${response.status}`;
    }
  }

  return error;
};

/**
 * ky 인스턴스에 인터셉터 설정
 */
export const setupInterceptors = (client: KyInstance): KyInstance => {
  return client.extend({
    hooks: {
      beforeRequest: [beforeRequestInterceptor],
      afterResponse: [afterResponseInterceptor],
      beforeError: [beforeErrorInterceptor],
    },
  });
};

import { publicApi } from "../client";
import type {
  ApiResponse,
  ChangePasswordRequest,
  LoginCredentialsDto,
  LoginResp,
  RegisterRequest,
  ResetPasswordRequest,
  User,
} from "../types";

function unwrapApiResponse<T>(data: ApiResponse<T>): T {
  if (data.error) {
    throw new Error(data.error.message || "요청에 실패했습니다.");
  }
  if (data.success === false || data.response == null) {
    throw new Error("요청에 실패했습니다.");
  }
  return data.response;
}

/**
 * ID/PW 로그인 — cama-plus-app `POST /api/auth`
 */
export const loginCredentials = async (
  dto: LoginCredentialsDto,
): Promise<LoginResp> => {
  const data = await publicApi
    .post("api/auth", { json: dto })
    .json<ApiResponse<LoginResp>>();
  return unwrapApiResponse(data);
};

/** @deprecated 서버 미제공 — 로컬 토큰 삭제만 사용 */
export const login = loginCredentials;

export const register = async (
  data: RegisterRequest,
): Promise<ApiResponse<User>> => {
  return publicApi
    .post("auth/register", { json: data })
    .json<ApiResponse<User>>();
};

/** 서버 logout API 없음 — 클라이언트에서 토큰만 제거 */
export const logout = async (): Promise<void> => {
  return Promise.resolve();
};

export const changePassword = async (
  data: ChangePasswordRequest,
): Promise<ApiResponse> => {
  return publicApi.put("auth/password", { json: data }).json<ApiResponse>();
};

export const resetPassword = async (
  data: ResetPasswordRequest,
): Promise<ApiResponse> => {
  return publicApi
    .post("auth/password/reset", { json: data })
    .json<ApiResponse>();
};

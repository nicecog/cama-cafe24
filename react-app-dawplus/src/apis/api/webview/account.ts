import { api } from "../../client";
import type {
  ApiResponse,
  WebviewAccount,
  WebviewHospitalInfo,
} from "../../types";

/**
 * 내 병원 정보 조회
 * POST /api/webview/account/hospital
 */
export const getAccountHospital = async (
  seq: string,
): Promise<ApiResponse<WebviewHospitalInfo>> => {
  return api
    .post("api/webview/account/hospital", {
      json: { seq },
    })
    .json();
};

/**
 * 회원정보 조회
 * POST /api/webview/account/me
 */
export const getAccountMe = async (
  loginId: string,
): Promise<ApiResponse<WebviewAccount>> => {
  return api
    .post("api/webview/account/me", {
      json: { loginId },
    })
    .json();
};

/**
 * 회원 탈퇴
 * POST /api/webview/account/withdrawal
 * @param loginId - 로그인 ID
 */
export const withdrawAccount = async (
  loginId: string,
): Promise<ApiResponse> => {
  return api
    .post("api/webview/account/withdrawal", {
      json: { loginId },
    })
    .json();
};

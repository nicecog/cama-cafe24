import { api } from "../../client";
import type {
  ApiResponse,
  PatientChangePasswordRequest,
  PatientChangePasswordResponse,
  PatientProfileUpdateRequest,
  PatientProfileUpdateResponse,
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
 * 회원 상세정보 수정
 * POST /api/webview/account/update
 */
export const updateAccountProfile = async (
  dto: PatientProfileUpdateRequest,
): Promise<ApiResponse<PatientProfileUpdateResponse>> => {
  return api
    .post("api/webview/account/update", {
      json: dto,
    })
    .json();
};

/**
 * 회원 비밀번호 변경
 * POST /api/webview/account/change-password
 */
export const changeAccountPassword = async (
  dto: PatientChangePasswordRequest,
): Promise<ApiResponse<PatientChangePasswordResponse>> => {
  return api
    .post("api/webview/account/change-password", {
      json: dto,
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

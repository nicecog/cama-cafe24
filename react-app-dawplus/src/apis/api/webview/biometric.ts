import { api } from "../../client";
import type { CamaFirebase } from "../../types/auth.types";
import type { ApiResponse, WebviewAccount } from "../../types";

export type BiometricStatusRequest = {
  loginId: string;
  deviceId: string;
};

export type BiometricStatusResponse = {
  passwordMustChange: boolean;
  deviceRegistered: boolean;
  biometricPromptDeclined: boolean;
  biometricLoginEnabled?: boolean;
};

export type BiometricEnrollRequest = {
  loginId: string;
  deviceId: string;
  platform: "ios" | "android";
  deviceName?: string;
};

export type BiometricEnrollResponse = {
  deviceRefreshToken: string;
  message?: string;
};

export type BiometricLoginRequest = {
  deviceId: string;
  refreshToken: string;
  firebase?: CamaFirebase;
};

export type BiometricLoginResponse = {
  apiToken: string;
  account: WebviewAccount;
};

export type BiometricDisableRequest = {
  loginId: string;
  deviceId?: string;
  disableAll?: boolean;
};

export const getBiometricStatus = async (
  dto: BiometricStatusRequest,
): Promise<ApiResponse<BiometricStatusResponse>> => {
  return api.post("api/webview/account/biometric/status", { json: dto }).json();
};

export const enrollBiometricDevice = async (
  dto: BiometricEnrollRequest,
): Promise<ApiResponse<BiometricEnrollResponse>> => {
  return api.post("api/webview/account/biometric/enroll", { json: dto }).json();
};

export const loginWithBiometric = async (
  dto: BiometricLoginRequest,
): Promise<ApiResponse<BiometricLoginResponse>> => {
  return api.post("api/webview/account/biometric/login", { json: dto }).json();
};

export const declineBiometricPrompt = async (
  loginId: string,
): Promise<ApiResponse<{ ok?: boolean; message?: string }>> => {
  return api
    .post("api/webview/account/biometric/decline", { json: { loginId } })
    .json();
};

export const disableBiometricLogin = async (
  dto: BiometricDisableRequest,
): Promise<ApiResponse<{ ok?: boolean; message?: string }>> => {
  return api
    .post("api/webview/account/biometric/disable", { json: dto })
    .json();
};

import type { WebviewAccount } from "./webview.types";

/** FCM / device info (cama-plus-app Firebase 와 동일 필드) */
export interface CamaFirebase {
  device: string;
  platform: "ANDROID" | "IOS";
  token: string;
}

export interface LoginCredentialsDto {
  principal: string;
  credentials: string;
  firebase: CamaFirebase;
}

/** POST /api/auth 응답 (axios interceptor unwrap 후) */
export interface LoginResp {
  account: WebviewAccount;
  apiToken: string;
}

/** @deprecated 템플릿 잔재 — 신규 코드는 LoginCredentialsDto 사용 */
export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  token: string;
  refreshToken?: string;
  user: User;
  expiresIn?: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  passwordConfirm: string;
  name: string;
  phone?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: "user" | "admin" | "doctor";
  avatar?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface ResetPasswordRequest {
  email: string;
}

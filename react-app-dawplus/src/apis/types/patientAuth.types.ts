import type { CamaFirebase } from "./auth.types";

export interface PatientRegisterRequest {
  loginId: string;
  password: string;
  passwordConfirm: string;
  email?: string;
  name: string;
  phone: string;
  birthday?: string;
  patientManagementNumber?: string;
  firebase?: CamaFirebase;
  lang?: string;
}

export interface PatientAvailabilityRequest {
  loginId?: string;
  email?: string;
  phone?: string;
  patientManagementNumber?: string;
}

export interface PatientAvailabilityResponse {
  available: boolean;
  message: string;
}

export interface PatientFindLoginIdRequest {
  name: string;
  phone: string;
}

export interface PatientFindLoginIdResponse {
  found: boolean;
  loginId?: string;
  message: string;
}

export interface PatientFindPasswordRequest {
  name: string;
  phone: string;
  email: string;
}

export interface PatientFindPasswordResponse {
  sent: boolean;
  message: string;
}

export interface PatientResetPasswordRequest {
  loginId: string;
  name: string;
  phone: string;
}

export interface PatientResetPasswordResponse {
  reset: boolean;
  temporaryPassword?: string;
  /** 계정에 이메일이 있어 임시 비밀번호 메일을 발송했는지 */
  emailSent?: boolean;
  message: string;
}

export interface PatientProfileUpdateRequest {
  loginId: string;
  name: string;
  phone: string;
  email?: string;
  birth?: string;
  gender?: "MALE" | "FEMALE" | "";
}

export interface PatientProfileUpdateResponse {
  updated: boolean;
  message: string;
}

export interface PatientChangePasswordRequest {
  loginId: string;
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface PatientChangePasswordResponse {
  changed: boolean;
  emailSent?: boolean;
  message: string;
}

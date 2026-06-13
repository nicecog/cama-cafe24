import { publicApi } from "../client";
import type {
  ApiResponse,
  PatientAvailabilityRequest,
  PatientAvailabilityResponse,
  PatientFindLoginIdRequest,
  PatientFindLoginIdResponse,
  PatientFindPasswordRequest,
  PatientFindPasswordResponse,
  PatientRegisterRequest,
  PatientResetPasswordRequest,
  PatientResetPasswordResponse,
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

export const checkPatientLoginId = async (
  dto: PatientAvailabilityRequest,
): Promise<PatientAvailabilityResponse> => {
  const data = await publicApi
    .post("api/account/patient/check/login-id", { json: dto })
    .json<ApiResponse<PatientAvailabilityResponse>>();
  return unwrapApiResponse(data);
};

export const checkPatientEmail = async (
  dto: PatientAvailabilityRequest,
): Promise<PatientAvailabilityResponse> => {
  const data = await publicApi
    .post("api/account/patient/check/email", { json: dto })
    .json<ApiResponse<PatientAvailabilityResponse>>();
  return unwrapApiResponse(data);
};

export const checkPatientPhone = async (
  dto: PatientAvailabilityRequest,
): Promise<PatientAvailabilityResponse> => {
  const data = await publicApi
    .post("api/account/patient/check/phone", { json: dto })
    .json<ApiResponse<PatientAvailabilityResponse>>();
  return unwrapApiResponse(data);
};

export const checkPatientNumber = async (
  dto: PatientAvailabilityRequest,
): Promise<PatientAvailabilityResponse> => {
  const data = await publicApi
    .post("api/account/patient/check/patient-number", { json: dto })
    .json<ApiResponse<PatientAvailabilityResponse>>();
  return unwrapApiResponse(data);
};

export const registerPatient = async (
  dto: PatientRegisterRequest,
): Promise<boolean> => {
  const data = await publicApi
    .post("api/account/patient/register", { json: dto })
    .json<ApiResponse<boolean>>();
  return unwrapApiResponse(data);
};

export const findPatientLoginId = async (
  dto: PatientFindLoginIdRequest,
): Promise<PatientFindLoginIdResponse> => {
  const data = await publicApi
    .post("api/public/patient/recover/login-id", { json: dto })
    .json<ApiResponse<PatientFindLoginIdResponse>>();
  return unwrapApiResponse(data);
};

export const findPatientPassword = async (
  dto: PatientFindPasswordRequest,
): Promise<PatientFindPasswordResponse> => {
  const data = await publicApi
    .post("api/public/patient/recover/password", { json: dto })
    .json<ApiResponse<PatientFindPasswordResponse>>();
  return unwrapApiResponse(data);
};

export const resetPatientPassword = async (
  dto: PatientResetPasswordRequest,
): Promise<PatientResetPasswordResponse> => {
  const data = await publicApi
    .post("api/public/patient/recover/reset-password", { json: dto })
    .json<ApiResponse<PatientResetPasswordResponse>>();
  return unwrapApiResponse(data);
};

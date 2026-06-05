import { GenderType } from '@/constants/enums';
import { Firebase } from '@/constants/interfaces';

export interface LoginCredentialsDto {
  principal: string;
  credentials: string;
  firebase: Firebase;
}

export interface PatientRegisterDto {
  loginId: string;
  password: string;
  passwordConfirm: string;
  email: string;
  name: string;
  phone: string;
  gender?: GenderType;
  birthday?: string;
  patientManagementNumber?: string;
  firebase?: Firebase;
  lang?: string;
}

export interface PatientAvailabilityDto {
  loginId?: string;
  email?: string;
  phone?: string;
  patientManagementNumber?: string;
}

export interface PatientFindLoginIdDto {
  name: string;
  phone: string;
}

export interface PatientFindPasswordDto {
  name: string;
  phone: string;
  email: string;
}

export interface PatientResetPasswordDto {
  loginId: string;
  name: string;
  phone: string;
}

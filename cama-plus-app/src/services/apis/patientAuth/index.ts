import mainApiClient from '@/services/apis/mainApiClient';

import {
  PatientAvailabilityDto,
  PatientFindLoginIdDto,
  PatientFindPasswordDto,
  PatientRegisterDto,
  PatientResetPasswordDto,
} from '@/services/apis/patientAuth/request';
import {
  PatientAvailabilityResp,
  PatientFindLoginIdResp,
  PatientFindPasswordResp,
  PatientResetPasswordResp,
} from '@/services/apis/patientAuth/response';

const patientAuthApi = {
  checkLoginId(dto: PatientAvailabilityDto) {
    return mainApiClient.post<PatientAvailabilityResp>(
      '/api/account/patient/check/login-id',
      dto,
    );
  },
  checkEmail(dto: PatientAvailabilityDto) {
    return mainApiClient.post<PatientAvailabilityResp>(
      '/api/account/patient/check/email',
      dto,
    );
  },
  checkPhone(dto: PatientAvailabilityDto) {
    return mainApiClient.post<PatientAvailabilityResp>(
      '/api/account/patient/check/phone',
      dto,
    );
  },
  checkPatientNumber(dto: PatientAvailabilityDto) {
    return mainApiClient.post<PatientAvailabilityResp>(
      '/api/account/patient/check/patient-number',
      dto,
    );
  },
  register(dto: PatientRegisterDto) {
    return mainApiClient.post<boolean>('/api/account/patient/register', dto);
  },
  findLoginId(dto: PatientFindLoginIdDto) {
    return mainApiClient.post<PatientFindLoginIdResp>(
      '/api/public/patient/recover/login-id',
      dto,
    );
  },
  findPassword(dto: PatientFindPasswordDto) {
    return mainApiClient.post<PatientFindPasswordResp>(
      '/api/public/patient/recover/password',
      dto,
    );
  },
  resetPassword(dto: PatientResetPasswordDto) {
    return mainApiClient.post<PatientResetPasswordResp>(
      '/api/public/patient/recover/reset-password',
      dto,
    );
  },
};

export default patientAuthApi;

package com.cama.back.service.account;

import com.cama.back.dto.account.*;

public interface PatientAccountService {

    PatientAvailabilityResponse checkLoginIdAvailable(String loginId);

    PatientAvailabilityResponse checkEmailAvailable(String email);

    PatientAvailabilityResponse checkPhoneAvailable(String phone);

    PatientAvailabilityResponse checkPatientNumberAvailable(String patientManagementNumber);

    void register(PatientRegisterRequest request);

    PatientFindLoginIdResponse findLoginId(PatientFindLoginIdRequest request);

    PatientFindPasswordResponse sendTemporaryPassword(PatientFindPasswordRequest request);

    PatientResetPasswordResponse resetPassword(PatientResetPasswordRequest request);

    PatientProfileUpdateResponse updateProfile(PatientProfileUpdateRequest request);

    PatientChangePasswordResponse changePassword(PatientChangePasswordRequest request);
}

package com.cama.back.dto.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientChangePasswordRequest {

    private String loginId;
    private String currentPassword;
    private String newPassword;
    private String newPasswordConfirm;
}

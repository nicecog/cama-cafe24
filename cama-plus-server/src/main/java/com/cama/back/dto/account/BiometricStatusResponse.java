package com.cama.back.dto.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiometricStatusResponse {
    private boolean passwordMustChange;
    private boolean deviceRegistered;
    private boolean biometricPromptDeclined;
    private boolean biometricLoginEnabled;
}

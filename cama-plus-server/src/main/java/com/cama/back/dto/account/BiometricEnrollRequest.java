package com.cama.back.dto.account;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BiometricEnrollRequest {
    private String loginId;
    private String deviceId;
    private String platform;
    private String deviceName;
}

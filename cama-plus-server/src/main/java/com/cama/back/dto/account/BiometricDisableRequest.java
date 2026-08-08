package com.cama.back.dto.account;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BiometricDisableRequest {
    private String loginId;
    private String deviceId;
    private boolean disableAll;
}

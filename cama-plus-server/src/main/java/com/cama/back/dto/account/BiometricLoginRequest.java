package com.cama.back.dto.account;

import com.cama.back.domain.firebase.Firebase;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BiometricLoginRequest {
    private String deviceId;
    private String refreshToken;
    private Firebase firebase;
}

package com.cama.back.dto.account;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class BiometricDeclineRequest {
    private String loginId;
}

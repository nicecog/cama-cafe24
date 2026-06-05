package com.cama.back.domain.apple;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TokenResponse {

    private String accessToken;

    private String tokenType;

    private Long expiresIn;

    private String refreshToken;

    private String idToken;

}

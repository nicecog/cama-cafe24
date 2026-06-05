package com.cama.back.domain.iamport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ImportResponseDto {

    private String accessToken;
    private Long now;
    private Long expiredAt;

}

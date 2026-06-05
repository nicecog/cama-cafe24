package com.cama.back.domain.iamport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IamportResponse {

    private Long code;

    private String message;

    private ImportResponseDto response;

}

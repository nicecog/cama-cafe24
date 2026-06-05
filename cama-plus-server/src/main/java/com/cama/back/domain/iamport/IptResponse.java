package com.cama.back.domain.iamport;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class IptResponse {

    String accessToken;
    Long now;
    Long expiredAt;

}

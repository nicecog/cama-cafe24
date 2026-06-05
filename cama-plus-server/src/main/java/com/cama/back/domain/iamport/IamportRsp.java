package com.cama.back.domain.iamport;

import lombok.*;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IamportRsp {

    private int code;

    private String message;

    private IptPayment response;

}

package com.cama.tablet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QrPayload {
    private int v = 1;
    /** v2 서명 토큰 (JWT) */
    private String t;
    private String loginId;
    private Long accountSeq;
}

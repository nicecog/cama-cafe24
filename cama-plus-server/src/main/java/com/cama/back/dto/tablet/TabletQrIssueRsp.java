package com.cama.back.dto.tablet;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TabletQrIssueRsp {
    private String token;
    private String qrPayload;
    private long expiresAtEpochMs;
    private int ttlSeconds;
}

package com.cama.tablet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QrIssueResponse {
    private String token;
    private String qrPayload;
    private long expiresAtEpochMs;
    private int ttlSeconds;
}

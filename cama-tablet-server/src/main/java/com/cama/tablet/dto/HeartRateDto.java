package com.cama.tablet.dto;

import lombok.Getter;
import lombok.Setter;

/** 심박 — 기존 DB 미구현. 추후 wearable 연동 시 채움 */
@Getter
@Setter
public class HeartRateDto {
    private boolean available;
    private String message;
    private Integer latestBpm;
    private String measuredAt;
}

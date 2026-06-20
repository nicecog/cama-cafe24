package com.cama.back.mapper;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FcmTestModeRow {

    private String sessionId;

    private int backedUpCount;

    private String preparedAt;
}

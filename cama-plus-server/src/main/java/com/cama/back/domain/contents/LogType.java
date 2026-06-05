package com.cama.back.domain.contents;


import com.cama.back.domain.api.EnumModel;

import java.util.Arrays;

public enum LogType implements EnumModel {

    SERVICE_ON("SERVICE_ON"), // 암정보 가이드 신청
    SERVICE_OFF("SERVICE_OFF"), // 암정보 가이드 신청전
    GUEST("GUEST");

    private final String value;

    LogType(String value) {
        this.value = value;
    }

    @Override
    public String getKey() {
        return name();
    }

    @Override
    public String getValue() {
        return value;
    }

    public static LogType getStatusKey(String value) {
        return Arrays.stream(values())
                .filter(x -> x.value.equalsIgnoreCase(value))
                .findFirst()
                .orElse(null);
    }

}

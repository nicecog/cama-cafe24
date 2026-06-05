package com.cama.back.domain.account;


import com.cama.back.domain.api.EnumModel;

import java.util.Arrays;

public enum SignType implements EnumModel {

    DEFAULT("DEFAULT"),
    KAKAO("KAKAO"),
    NAVER("NAVER"),
    APPLE("APPLE"),
    GOOGLE("GOOGLE"),
    GENERAL("GENERAL");

    private final String value;

    SignType(String value) {
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

    public static SignType getStatusKey(String value) {
        return Arrays.stream(values())
                .filter(x -> x.value.equalsIgnoreCase(value))
                .findFirst()
                .orElse(null);
    }

}

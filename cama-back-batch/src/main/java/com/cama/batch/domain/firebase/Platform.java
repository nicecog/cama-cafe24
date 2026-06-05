package com.cama.batch.domain.firebase;


import com.cama.batch.domain.api.EnumModel;

import java.util.Arrays;

public enum Platform implements EnumModel {

    ANDROID("ANDROID"),
    IOS("IOS");

    private final String value;

    Platform(String value) {
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

    public static Platform getStatusKey(String value) {
        return Arrays.stream(values())
                .filter(x -> x.value.equalsIgnoreCase(value))
                .findFirst()
                .orElse(null);
    }

}

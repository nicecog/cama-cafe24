package com.cama.back.domain.firebase;


import com.cama.back.domain.api.EnumModel;
import com.fasterxml.jackson.annotation.JsonCreator;

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

    @JsonCreator
    public static Platform fromJson(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }
        Platform platform = getStatusKey(value);
        if (platform != null) {
            return platform;
        }
        try {
            return Platform.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            return null;
        }
    }

}

package com.cama.back.domain.account;


import com.cama.back.domain.api.EnumModel;

import java.util.Arrays;

public enum Gender implements EnumModel {

    MALE("MALE"),
    FEMALE("FEMALE");

    private final String value;

    Gender(String value) {
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

    public static Gender getStatusKey(String value) {
        return Arrays.stream(values())
                .filter(x -> x.value.equalsIgnoreCase(value))
                .findFirst()
                .orElse(null);
    }

}

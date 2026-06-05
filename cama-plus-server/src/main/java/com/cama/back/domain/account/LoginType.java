package com.cama.back.domain.account;


import com.cama.back.domain.api.EnumModel;

import java.util.Arrays;

public enum LoginType implements EnumModel {

    GENERAL("GENERAL"),
    PASS("PASS"),
    SNS("SNS"),
    DOCTOR("DOCTOR"),
    ADMIN("ADMIN");

    private final String value;

    LoginType(String value) {
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

    public static LoginType getStatusKey(String value) {
        return Arrays.stream(values())
                .filter(x -> x.value.equalsIgnoreCase(value))
                .findFirst()
                .orElse(null);
    }

}

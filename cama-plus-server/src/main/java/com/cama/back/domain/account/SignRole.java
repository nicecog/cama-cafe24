package com.cama.back.domain.account;

public enum SignRole {

    USER("ROLE_USER"),
    OWNER("ROLE_OWNER");

    private final String value;

    SignRole(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

}

package com.cama.back.domain.account;

public enum AccountRole {

    USER("ROLE_USER"),
    DOCTOR("ROLE_DOCTOR"),
    ADMIN("ROLE_ADMIN");

    private final String value;

    AccountRole(String value) {
        this.value = value;
    }

    public String value() {
        return value;
    }

}

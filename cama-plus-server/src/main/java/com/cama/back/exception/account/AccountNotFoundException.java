package com.cama.back.exception.account;

import lombok.Getter;

public class AccountNotFoundException extends RuntimeException {

    @Getter
    private final String loginId;

    public AccountNotFoundException(String loginId) {
        super(loginId);
        this.loginId = loginId;
    }

    public AccountNotFoundException() {
        super();
        loginId = null;
    }

}

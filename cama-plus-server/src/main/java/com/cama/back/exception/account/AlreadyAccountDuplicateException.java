package com.cama.back.exception.account;

import lombok.Getter;

public class AlreadyAccountDuplicateException extends RuntimeException {

    @Getter
    private final String loginId;

    public AlreadyAccountDuplicateException(String loginId) {
        this.loginId = loginId;
    }


}

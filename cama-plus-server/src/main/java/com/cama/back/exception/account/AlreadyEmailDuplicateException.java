package com.cama.back.exception.account;

import lombok.Getter;

public class AlreadyEmailDuplicateException extends RuntimeException {

    @Getter
    private final String email;

    public AlreadyEmailDuplicateException(String email) {
        this.email = email;
    }


}

package com.cama.back.exception.common;

import lombok.Getter;

public class UnauthorizedException extends RuntimeException {

    @Getter
    private final String message;

    public UnauthorizedException(String message) {
        this.message = message;
    }


}

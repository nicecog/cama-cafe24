package com.cama.back.exception.sns;

import lombok.Getter;

public class SnsDataBindingException extends RuntimeException {

    @Getter
    private final String message;

    public SnsDataBindingException(String message) {
        this.message = message;
    }


}

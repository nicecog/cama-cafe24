package com.cama.back.exception.iamport;

import lombok.Getter;

public class IamportException extends RuntimeException {

    @Getter
    private String message;

    public IamportException() {

    }

    public IamportException(String message) {

        this.message = message;

    }


}

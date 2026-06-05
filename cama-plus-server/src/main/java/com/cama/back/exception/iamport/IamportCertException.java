package com.cama.back.exception.iamport;

import lombok.Getter;

public class IamportCertException extends RuntimeException {

    @Getter
    private String message;

    public IamportCertException() {

    }

    public IamportCertException(String message) {

        this.message = message;

    }


}

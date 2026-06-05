package com.cama.back.exception.iamport;

import lombok.Getter;

public class IamportResponseException extends RuntimeException {

    @Getter
    private final String impUid;

    public IamportResponseException(String impUid) {
        this.impUid = impUid;
    }


}

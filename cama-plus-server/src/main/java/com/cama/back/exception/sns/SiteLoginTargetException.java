package com.cama.back.exception.sns;

import lombok.Getter;

public class SiteLoginTargetException extends RuntimeException {

    @Getter
    private final String email;

    public SiteLoginTargetException(String email) {
        this.email = email;
    }


}

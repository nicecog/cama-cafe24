package com.cama.back.exception.doctor;

import lombok.Getter;

public class AlreadyDoctorDuplicateException extends RuntimeException {

    @Getter
    private final String loginId;

    public AlreadyDoctorDuplicateException(String loginId) {
        this.loginId = loginId;
    }


}

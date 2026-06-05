package com.cama.back.security;

import com.cama.back.domain.doctor.CmDoctor;
import lombok.Getter;

import static com.google.common.base.Preconditions.checkNotNull;

@Getter
public class AuthenticationDoctorResult {

    private final String apiToken;
    private final CmDoctor doctor;

    AuthenticationDoctorResult(String apiToken, CmDoctor doctor) {
        checkNotNull(apiToken, "apiToken must be provided.");
        checkNotNull(doctor, "doctor must be provided.");

        this.apiToken = apiToken;
        this.doctor = doctor;
    }

}

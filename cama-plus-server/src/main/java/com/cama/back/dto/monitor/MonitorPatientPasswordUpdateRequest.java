package com.cama.back.dto.monitor;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonitorPatientPasswordUpdateRequest {

    public static final String MODE_RANDOM = "RANDOM";
    public static final String MODE_MANUAL = "MANUAL";

    private Long acSeq;
    /** RANDOM | MANUAL */
    private String mode;
    private String password;
    private String passwordConfirm;
}

package com.cama.back.dto.monitor;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MonitorPatientEmailUpdateRequest {

    private Long acSeq;
    private String email;
}

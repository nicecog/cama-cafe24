package com.cama.back.dto.monitor;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class MonitorPatientPasswordUpdateResponse {

    private boolean updated;
    /** RANDOM 모드일 때 생성된 비밀번호 (관리자 확인용) */
    private String generatedPassword;
    private String message;
}

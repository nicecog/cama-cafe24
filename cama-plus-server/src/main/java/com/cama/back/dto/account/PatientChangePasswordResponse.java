package com.cama.back.dto.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientChangePasswordResponse {

    private boolean changed;
    /** 등록된 이메일로 변경 안내 메일 발송 여부 */
    private boolean emailSent;
    private String message;
}

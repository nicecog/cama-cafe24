package com.cama.back.dto.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientAvailabilityRequest {

    @Schema(description = "로그인 ID")
    private String loginId;

    @Schema(description = "이메일")
    private String email;

    @Schema(description = "전화번호")
    private String phone;

    @Schema(description = "환자번호")
    private String patientManagementNumber;
}

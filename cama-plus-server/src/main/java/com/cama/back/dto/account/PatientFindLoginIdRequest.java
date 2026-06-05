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
public class PatientFindLoginIdRequest {

    @Schema(description = "이름", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Schema(description = "전화번호", requiredMode = Schema.RequiredMode.REQUIRED)
    private String phone;
}

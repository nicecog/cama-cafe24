package com.cama.back.dto.account;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class ChangeLoginIdRequest {

    @Schema(description = "새 로그인 ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String newLoginId;

    @Schema(description = "현재 비밀번호 (본인 확인)", requiredMode = Schema.RequiredMode.REQUIRED)
    private String credentials;
}

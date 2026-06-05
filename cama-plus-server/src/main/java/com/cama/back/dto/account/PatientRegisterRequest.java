package com.cama.back.dto.account;

import com.cama.back.domain.account.Gender;
import com.cama.back.domain.firebase.Firebase;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientRegisterRequest {

    @Schema(description = "로그인 ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String loginId;

    @Schema(description = "비밀번호", requiredMode = Schema.RequiredMode.REQUIRED)
    private String password;

    @Schema(description = "비밀번호 확인", requiredMode = Schema.RequiredMode.REQUIRED)
    private String passwordConfirm;

    @Schema(description = "이메일 (선택)")
    private String email;

    @Schema(description = "이름", requiredMode = Schema.RequiredMode.REQUIRED)
    private String name;

    @Schema(description = "전화번호", requiredMode = Schema.RequiredMode.REQUIRED)
    private String phone;

    @Schema(description = "성별")
    private Gender gender;

    @Schema(description = "생년월일 (yyyy-MM-dd)")
    private String birthday;

    @Schema(description = "환자번호 (선택)")
    private String patientManagementNumber;

    @Schema(description = "Firebase 정보")
    private Firebase firebase;

    @Schema(description = "언어")
    private String lang;
}

package com.cama.back.controller.account;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.account.PatientFindLoginIdRequest;
import com.cama.back.dto.account.PatientFindLoginIdResponse;
import com.cama.back.dto.account.PatientFindPasswordRequest;
import com.cama.back.dto.account.PatientFindPasswordResponse;
import com.cama.back.dto.account.PatientResetPasswordRequest;
import com.cama.back.dto.account.PatientResetPasswordResponse;
import com.cama.back.service.account.PatientAccountService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/public/patient")
@Tag(name = "환자 계정 찾기 (공개) APIs")
public class PublicPatientAccountRestController {

    private final PatientAccountService patientAccountService;

    public PublicPatientAccountRestController(PatientAccountService patientAccountService) {
        this.patientAccountService = patientAccountService;
    }

    @PostMapping("recover/login-id")
    @Operation(summary = "아이디 찾기 (이름 + 전화번호)")
    public ApiResult<PatientFindLoginIdResponse> recoverLoginId(@RequestBody PatientFindLoginIdRequest dto) {
        return new ApiResult<>(patientAccountService.findLoginId(dto));
    }

    @PostMapping("recover/password")
    @Operation(summary = "비밀번호 찾기 (이름 + 전화번호 + 이메일)")
    public ApiResult<PatientFindPasswordResponse> recoverPassword(@RequestBody PatientFindPasswordRequest dto) {
        return new ApiResult<>(patientAccountService.sendTemporaryPassword(dto));
    }

    @PostMapping("recover/reset-password")
    @Operation(summary = "비밀번호 초기화 (아이디 + 이름 + 전화번호)")
    public ApiResult<PatientResetPasswordResponse> resetPassword(@RequestBody PatientResetPasswordRequest dto) {
        return new ApiResult<>(patientAccountService.resetPassword(dto));
    }
}

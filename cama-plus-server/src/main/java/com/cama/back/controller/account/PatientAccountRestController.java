package com.cama.back.controller.account;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.account.*;
import com.cama.back.service.account.PatientAccountService;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@RestController
@RequestMapping("api/account/patient")
@Tag(name = "환자 회원 (ID/PW) APIs")
public class PatientAccountRestController {

    private final PatientAccountService patientAccountService;

    public PatientAccountRestController(PatientAccountService patientAccountService) {
        this.patientAccountService = patientAccountService;
    }

    @PostMapping("check/login-id")
    @Operation(summary = "로그인 ID 중복 확인")
    public ApiResult<PatientAvailabilityResponse> checkLoginId(@RequestBody PatientAvailabilityRequest dto) {
        checkArgument(isNotEmpty(dto.getLoginId()), "로그인 ID는 필수입니다.");
        return new ApiResult<>(patientAccountService.checkLoginIdAvailable(dto.getLoginId()));
    }

    @PostMapping("check/email")
    @Operation(summary = "이메일 중복 확인 (입력 시)")
    public ApiResult<PatientAvailabilityResponse> checkEmail(@RequestBody PatientAvailabilityRequest dto) {
        return new ApiResult<>(patientAccountService.checkEmailAvailable(dto.getEmail()));
    }

    @PostMapping("check/phone")
    @Operation(summary = "전화번호 중복 확인")
    public ApiResult<PatientAvailabilityResponse> checkPhone(@RequestBody PatientAvailabilityRequest dto) {
        checkArgument(isNotEmpty(dto.getPhone()), "전화번호는 필수입니다.");
        return new ApiResult<>(patientAccountService.checkPhoneAvailable(dto.getPhone()));
    }

    @PostMapping("check/patient-number")
    @Operation(summary = "환자번호 중복 확인")
    public ApiResult<PatientAvailabilityResponse> checkPatientNumber(@RequestBody PatientAvailabilityRequest dto) {
        return new ApiResult<>(patientAccountService.checkPatientNumberAvailable(dto.getPatientManagementNumber()));
    }

    @PostMapping("register")
    @Operation(summary = "환자 회원가입 (ID/PW)")
    public ApiResult<Boolean> register(@RequestBody PatientRegisterRequest dto) {
        patientAccountService.register(dto);
        return new ApiResult<>(true);
    }

    @PostMapping({"find/login-id", "recover/login-id"})
    @Operation(summary = "아이디 찾기 (이름 + 전화번호)")
    public ApiResult<PatientFindLoginIdResponse> findLoginId(@RequestBody PatientFindLoginIdRequest dto) {
        return new ApiResult<>(patientAccountService.findLoginId(dto));
    }

    @PostMapping({"find/password", "recover/password"})
    @Operation(summary = "비밀번호 찾기 (이름 + 전화번호 + 이메일)")
    public ApiResult<PatientFindPasswordResponse> findPassword(@RequestBody PatientFindPasswordRequest dto) {
        return new ApiResult<>(patientAccountService.sendTemporaryPassword(dto));
    }

    @PostMapping({"recover/reset-password"})
    @Operation(summary = "비밀번호 초기화 (아이디 + 이름 + 전화번호)")
    public ApiResult<PatientResetPasswordResponse> resetPassword(@RequestBody PatientResetPasswordRequest dto) {
        return new ApiResult<>(patientAccountService.resetPassword(dto));
    }
}

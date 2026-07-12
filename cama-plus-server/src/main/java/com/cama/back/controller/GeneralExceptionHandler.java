package com.cama.back.controller;

import com.auth0.jwt.exceptions.SignatureVerificationException;
import com.cama.back.domain.api.ApiResult;
import com.cama.back.exception.*;
import com.cama.back.exception.account.*;
import com.cama.back.exception.common.*;
import com.cama.back.exception.contents.Contents2NotFoundException;
import com.cama.back.exception.contents.ContentsAuthException;
import com.cama.back.exception.contents.ContentsNotFoundException;
import com.cama.back.exception.disease.AlreadyDiseaseDuplicateException;
import com.cama.back.exception.disease.DiseaseDetailNotFoundException;
import com.cama.back.exception.disease.DiseaseNotFoundException;
import com.cama.back.exception.doctor.AlreadyDoctorDuplicateException;
import com.cama.back.exception.hospital.*;
import com.cama.back.exception.iamport.IamportResponseException;
import com.cama.back.exception.sns.SiteLoginTargetException;
import com.cama.back.exception.sns.SnsDataBindingException;
import com.cama.back.exception.track.CareTrackNotFoundException;
import com.cama.back.exception.wellbeing.WellbeingResourceNotFoundException;

import org.springframework.dao.IncorrectResultSizeDataAccessException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.List;
import java.util.stream.Collectors;

@ControllerAdvice
public class GeneralExceptionHandler {

    private ResponseEntity<ApiResult> createResponse(Throwable throwable, HttpStatus status) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        return new ResponseEntity<>(new ApiResult(throwable, status), headers, status);
    }

    private ResponseEntity<ApiResult> createResponse(String message, HttpStatus status) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        return new ResponseEntity<>(new ApiResult(message, status), headers, status);
    }

    private ResponseEntity<ApiResult> createResponse(String message, HttpStatus status, int code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        return new ResponseEntity<>(new ApiResult(message, status, code), headers, status);
    }

    @ExceptionHandler({IllegalStateException.class, IllegalArgumentException.class})
    public ResponseEntity<?> handleBadRequestException(Exception e) {
        return createResponse(e, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Base64InvalidFormatException.class)
    public ResponseEntity<?> handleBase64InvalidFormatException(Base64InvalidFormatException e) {
        return createResponse("유효하지 않는 BASE64 형태입니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AlreadyHospitalServiceApplyException.class)
    public ResponseEntity<?> handleAlreadyHospitalServiceApplyException(AlreadyHospitalServiceApplyException e) {
        return createResponse("이미 신청한 서비스 정보가 있습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HospitalServiceNotFoundException.class)
    public ResponseEntity<?> handleHospitalServiceNotFoundException(HospitalServiceNotFoundException e) {
        return createResponse("서비스 신청 정보가 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CareTrackNotFoundException.class)
    public ResponseEntity<?> handleCareTrackNotFoundException(CareTrackNotFoundException e) {
        return createResponse("암정보 가이드 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TrackResponseException.class)
    public ResponseEntity<?> handleTrackResponseException(TrackResponseException e) {
        return createResponse("암정보 가이드 서비스 호출 응답 에러", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DiseaseNotFoundException.class)
    public ResponseEntity<?> handleDiseaseNotFoundException(DiseaseNotFoundException e) {
        return createResponse("질병 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DiseaseDetailNotFoundException.class)
    public ResponseEntity<?> handleDiseaseDetailNotFoundException(DiseaseDetailNotFoundException e) {
        return createResponse("질병 상세 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SnsMemberNotUsedException.class)
    public ResponseEntity<?> handleSnsMemberNotUsedException(SnsMemberNotUsedException e) {
        return createResponse("SNS 회원은 이용할 수 없는 API 입니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(MailException.class)
    public ResponseEntity<?> handleMailException(MailException e) {
        return createResponse(
                "이메일 발송에 실패했습니다. 잠시 후 다시 시도해 주세요.",
                HttpStatus.SERVICE_UNAVAILABLE);
    }

    @ExceptionHandler(AccountNotFoundException.class)
    public ResponseEntity<?> handleAccountNotFoundException(AccountNotFoundException e) {
        String message = e.getMessage();
        if (message == null || message.isBlank()) {
            message = "계정 정보를 찾을 수 없습니다.";
        }
        return createResponse(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<?> handleUsernameNotFoundException(UsernameNotFoundException e) {
        String message = e.getMessage();
        if (message == null || message.isBlank()) {
            message = "계정 정보를 찾을 수 없습니다.";
        }
        return createResponse(message, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IncorrectResultSizeDataAccessException.class)
    public ResponseEntity<?> handleIncorrectResultSizeDataAccessException(
            IncorrectResultSizeDataAccessException e) {
        return createResponse("일치하는 회원 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HospitalNotFoundException.class)
    public ResponseEntity<?> handleHospitalNotFoundException(HospitalNotFoundException e) {
        return createResponse("병원 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AlreadyEmailDuplicateException.class)
    public ResponseEntity<?> handleAlreadyEmailDuplicateException(AlreadyEmailDuplicateException e) {
        return createResponse("이미 중복된 이메일이 있습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> handleUnauthorizedException(UnauthorizedException e) {
        return createResponse("Unauthorized ( " + e.getMessage() + " ) error.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PasswordNotMatchingException.class)
    public ResponseEntity<?> handlePasswordNotMatchingException(PasswordNotMatchingException e) {
        return createResponse("아이디 혹은 비밀번호가 올바르지 않습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(Contents2NotFoundException.class)
    public ResponseEntity<?> handleContents2NotFoundException(Contents2NotFoundException e) {
//      return createResponse("치료 정보가 충분하지 않습니다.", HttpStatus.BAD_REQUEST);
        return createResponse("금일차 암정보 가이드 볼거리 정보가 존재 하지 않습니다. 내정보에서 암정보 가이드 신청 종료 후 암정보 가이드를 다시 설정 해주세요.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SiteLoginTargetException.class)
    public ResponseEntity<?> handleSiteLoginTargetException(SiteLoginTargetException e) {
        return createResponse(e.getEmail() + " 은 일반 계정입니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(IamportResponseException.class)
    public ResponseEntity<?> handleIamportResponseException(IamportResponseException e) {
        return createResponse("아임포트 에러", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SignatureVerificationException.class)
    public ResponseEntity<?> handleSignatureVerificationException(SignatureVerificationException e) {
        return createResponse("인증이 잘못되었습니다. ( " + e.getMessage() + " )", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(WriteNotFoundException.class)
    public ResponseEntity<?> handleWriteNotFoundException(WriteNotFoundException e) {
        return createResponse("작성한 글을 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(WriteAuthorizationException.class)
    public ResponseEntity<?> handleWriteAuthorizationException(WriteAuthorizationException e) {
        return createResponse("수정이나 삭제 할 권한이 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AlreadyAccountDuplicateException.class)
    public ResponseEntity<?> handleWriteAuthorizationException(AlreadyAccountDuplicateException e) {
        return createResponse("이미 가입된 계정이 있습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccountWalletNotFoundException.class)
    public ResponseEntity<?> handleAccountWalletNotFoundException(AccountWalletNotFoundException e) {
        return createResponse("지갑 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ContentsNotFoundException.class)
    public ResponseEntity<?> handleContentsNotFoundException(ContentsNotFoundException e) {
        return createResponse("치료정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(WellbeingResourceNotFoundException.class)
    public ResponseEntity<?> handleContentsNotFoundException(WellbeingResourceNotFoundException e) {
        return createResponse("웰빙자원정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ContentsAuthException.class)
    public ResponseEntity<?> handleContentsAuthException(ContentsAuthException e) {
        return createResponse("치료정보를 수정 할 수 있는 권한이 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(SnsDataBindingException.class)
    public ResponseEntity<?> handleSnsDataBindingException(SnsDataBindingException e) {
        return createResponse(e.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(LoginAccessDeniedException.class)
    public ResponseEntity<?> handleLoginAccessDeniedException(LoginAccessDeniedException e) {
        return createResponse("정상적인 로그인 시도가 아닙니다. 버럭!", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AlreadyScheduleException.class)
    public ResponseEntity<?> handleAlreadyScheduleException(AlreadyScheduleException e) {
        return createResponse("이미 신청한 스케줄 정보가 있습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ScheduleNotFoundException.class)
    public ResponseEntity<?> handleScheduleNotFoundException(ScheduleNotFoundException e) {
        return createResponse("일정 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccountHospitalNotFoundException.class)
    public ResponseEntity<?> handleAccountHospitalNotFoundException(AccountHospitalNotFoundException e) {
        return createResponse("유저의 병원 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ScheduleBatchNotFoundException.class)
    public ResponseEntity<?> handleScheduleBatchNotFoundException(ScheduleBatchNotFoundException e) {
        return createResponse("스케쥴 상세 일정 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConsultationInquiryNotFoundException.class)
    public ResponseEntity<?> handleConsultationInquiryNotFoundException(ConsultationInquiryNotFoundException e) {
        return createResponse("진찰시 문의사항을 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ConsultationInquiryLimitExceededException.class)
    public ResponseEntity<?> handleConsultationInquiryLimitExceededException(ConsultationInquiryLimitExceededException e) {
        return createResponse("미전송 문의사항은 최대 5개까지 등록할 수 있습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AlreadyTrackServiceException.class)
    public ResponseEntity<?> handleAlreadyTrackServiceException(AlreadyTrackServiceException e) {
        return createResponse("이미 신청한 트랙 서비스가 있습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AccountSecureNotFoundException.class)
    public ResponseEntity<?> handleAccountSecureNotFoundException(AccountSecureNotFoundException e) {
        return createResponse("관계자 코드 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AlreadyDoctorDuplicateException.class)
    public ResponseEntity<?> handleAlreadyDoctorDuplicateException(AlreadyDoctorDuplicateException e) {
        return createResponse("중복된 의사 로그인 계정이 있습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DepartmentNotFoundException.class)
    public ResponseEntity<?> handleDepartmentNotFoundException(DepartmentNotFoundException e) {
        return createResponse("전공 정보를 찾을 수 없습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AlreadyDiseaseDuplicateException.class)
    public ResponseEntity<?> handleAlreadyDiseaseDuplicateException(AlreadyDiseaseDuplicateException e) {
        return createResponse("중복된 질환정보가 있습니다.", HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(AlreadyDepartmentDuplicateException.class)
    public ResponseEntity<?> handleAlreadyDepartmentDuplicateException(AlreadyDepartmentDuplicateException e) {
        return createResponse("중복된 전공 이름이 있습니다.", HttpStatus.BAD_REQUEST);
    }

    //
    @ExceptionHandler(StoreAuthorizationException.class)
    public ResponseEntity<?> handleStoreAuthorizationException(StoreAuthorizationException e) {
        return createResponse("매장 접근 권한이 없습니다.", HttpStatus.BAD_REQUEST);
    }

    //

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<?> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

        final BindingResult bindingResult = e.getBindingResult();
        final List<FieldError> errors = bindingResult.getFieldErrors();

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Type", "application/json");
        return new ResponseEntity<>(new ApiResult(errors.parallelStream().map(error -> (error.getField() + " " + error.getDefaultMessage())).collect(Collectors.toList())), headers, HttpStatus.BAD_REQUEST);

    }

}

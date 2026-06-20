package com.cama.back.controller.doctor;


import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.coaching.ExerciseSurveyResult;
import com.cama.back.dto.coaching.UserAnswerInfo;
import com.cama.back.dto.monitor.AdminNotificationSendRequest;
import com.cama.back.dto.monitor.AdminNotificationSendResult;
import com.cama.back.dto.monitor.FcmTestModeStatusRsp;
import com.cama.back.dto.monitor.MonitorAcctStatDTO;
import com.cama.back.dto.monitor.MonitorCoachingDTO;
import com.cama.back.dto.monitor.MonitorPatientAccountDetailRsp;
import com.cama.back.dto.monitor.MonitorPatientEmailUpdateRequest;
import com.cama.back.dto.monitor.MonitorPatientPasswordUpdateRequest;
import com.cama.back.dto.monitor.MonitorPatientPasswordUpdateResponse;
import com.cama.back.dto.monitor.MonitorPatientRsp;
import com.cama.back.dto.monitor.MonitorSearchDTO;
import com.cama.back.dto.monitor.MonitorContentsDTO;
import com.cama.back.dto.track.StepRequest;
import com.cama.back.dto.track.TrackReqHst;
import com.cama.back.exception.account.AccountNotFoundException;
import com.cama.back.mapper.MonitorMapper;
import com.cama.back.mapper.CareTrackMapper;
import com.cama.back.security.JwtAuthentication;
import com.cama.back.service.monitor.MonitorPatientAccountService;
import com.cama.back.service.notification.FcmTestModeService;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

@RestController
@RequestMapping("api")
@Tag(name = "모니터링 APIs")
@Slf4j
public class MonitoringRestController {

    private final MonitorMapper monitorMapper;
    private final CareTrackMapper careTrackMapper;
    private final FcmTestModeService fcmTestModeService;
    private final MonitorPatientAccountService monitorPatientAccountService;

    public MonitoringRestController(MonitorMapper monitorMapper,
    		CareTrackMapper careTrackMapper,
    		FcmTestModeService fcmTestModeService,
    		MonitorPatientAccountService monitorPatientAccountService) {
        this.monitorMapper = monitorMapper;
        this.careTrackMapper = careTrackMapper;
        this.fcmTestModeService = fcmTestModeService;
        this.monitorPatientAccountService = monitorPatientAccountService;
    }

    @GetMapping(path = "monitoring/patient")
    @Operation(summary = "환자 모니터링 리스트")
    public ApiResult<List<MonitorPatientRsp>> getPatientMonitoring(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                   SearchParam searchParam) {

        Long doctorSeq = authentication.id.value();
        String lang = "KO";

        if (searchParam.getLang() == null) searchParam.setLang(lang);
        searchParam.setDSeq(doctorSeq);
        int totalCount = monitorMapper.getMonitorPatientListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<MonitorPatientRsp> list = monitorMapper.getMonitorPatientList(searchParam);

        List<MonitorPatientRsp> collect = list.stream().peek(s -> {
            double process = Double.parseDouble(String.format("%.2f", s.getProgress()));
            s.setProgress(process);
        }).collect(Collectors.toList());

        return new ApiResult<>(collect, pagination);

    }

    @GetMapping(path = "monitoring/notification/fcm-test-status")
    @Operation(summary = "FCM 테스트 모드 상태")
    public ApiResult<FcmTestModeStatusRsp> getFcmTestStatus() {
        return new ApiResult<>(fcmTestModeService.getStatus());
    }

    @PostMapping(path = "monitoring/notification/restore-fcm-test")
    @Operation(summary = "FCM 테스트 모드 해제 및 배치 복원")
    public ApiResult<FcmTestModeStatusRsp> restoreFcmTest() {
        return new ApiResult<>(fcmTestModeService.restoreTestMode());
    }

    @PostMapping(path = "monitoring/notification/send")
    @Operation(summary = "관리자 선택 환자 FCM 알림 전송")
    public ApiResult<AdminNotificationSendResult> sendAdminNotification(
            @RequestBody AdminNotificationSendRequest request) {
        return new ApiResult<>(fcmTestModeService.sendAdminNotification(request));
    }

    @GetMapping(path = "monitoring/{seq}/patient")
    @Operation(summary = "환자 모니터링 상세")
    public ApiResult<MonitorPatientRsp> getPatientMonitoringView(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                 @PathVariable Long seq) {

        Long doctorSeq = authentication.id.value();

        if (!monitorMapper.getMonitorPatientDetail(seq, doctorSeq).isPresent()) {
            throw new AccountNotFoundException();
        }

        MonitorPatientRsp monitorPatientRsp = monitorMapper.getMonitorPatientDetail(seq, doctorSeq).get();

        double process = Double.parseDouble(String.format("%.2f", monitorPatientRsp.getProgress()));
        monitorPatientRsp.setProgress(process);

        return new ApiResult<>(monitorPatientRsp);

    }
    
    @PostMapping(path = "monitoring/coaching/getCoachingMonitoringList")
    @Operation(summary = "건강코칭 모니터링 리스트")
    public ApiResult<List<MonitorCoachingDTO>> getCoachingMonitoringList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody MonitorCoachingDTO dto) {

        Long doctorSeq = authentication.id.value();

        dto.setDSeq(doctorSeq);
        
        int totalCount = monitorMapper.getCoachingListCount(dto);
        Pagination pagination = new Pagination(dto.getPage(), totalCount);
        dto.setPagination(pagination);

        List<MonitorCoachingDTO> list = monitorMapper.getCoachingMonitoringList(dto);

        List<MonitorCoachingDTO> collect = list.stream().peek(s -> {
            double process = Double.parseDouble(String.format("%.2f", s.getProgress()));
            s.setProgress(process);
        }).collect(Collectors.toList());

        return new ApiResult<>(collect, pagination);

    }
    

    @PostMapping(path = "monitoring/coaching/getCoachingDetailList")
    @Operation(summary = "건강코칭 모니터링 상세")
    public ApiResult<List<MonitorCoachingDTO>> getCoachingDetailList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody MonitorCoachingDTO dto) {

        Long doctorSeq = authentication.id.value();
        dto.setDSeq(doctorSeq);
        //log.info(" getCoachingDetailList MonitorCoachingDTO => {}" , dto.toString());

    	String name = "";
    	try {
    		name = monitorMapper.getAccountInfo(dto.getAcSeq());
    		dto.setName(name);
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}
    	
        List<MonitorCoachingDTO> list = monitorMapper.getCoachingDetailList(dto);
        //log.info(" getCoachingDetailList list => {}" , list.size());
        
        if (list.size() == 0) {
            throw new AccountNotFoundException();
        }

        return new ApiResult<>(list);

    }    
    
    @PutMapping(path = "monitoring/coaching/deleteAnswer")
    @Operation(summary = "질문 답변 삭제")
    public ApiResult<Boolean> deleteUserAnswerInfo(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody MonitorCoachingDTO dto) {
        int processCnt = 0;
        Boolean chk = false;
    	
        Long doctorSeq = authentication.id.value();
        dto.setDSeq(doctorSeq);
        //log.info(" getCoachingDetailList MonitorCoachingDTO => {}" , dto.toString());

    	String name = "";
    	try {
    		name = monitorMapper.getAccountInfo(dto.getAcSeq());
    		dto.setName(name);
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}

    	processCnt = monitorMapper.deleteUserAnswerInfo(dto);
        
    	chk = true;
        
        return new ApiResult<>(chk);

    }
    
    @PostMapping(path = "monitoring/coaching/getStepInfoList")
    @Operation(summary = "건강코칭 걸음 정보 리스트")
    public ApiResult<List<StepRequest>> getStepInfoList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody StepRequest dto) {

    	Long acSeq = dto.getAccountSeq();
    	dto.setAccountSeq(acSeq);
        List<StepRequest> list = careTrackMapper.getCareTrackStepList(dto);

        return new ApiResult<>(list);

    }
    
    @PostMapping(path = "monitoring/coaching/getTrackReqHstList")
    @Operation(summary = "암정보가이드 신청이력 리스트")
    public ApiResult<List<TrackReqHst>> getTrackReqHstList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody TrackReqHst dto) {

    	Long acSeq = dto.getAccountSeq();
    	dto.setAccountSeq(acSeq);
        List<TrackReqHst> list = careTrackMapper.getTrackReqHstList(dto);

        return new ApiResult<>(list);

    }  
    
    @PostMapping(path = "monitoring/coaching/getExerciseSurveyResultList")
    @Operation(summary = "운동정보 설문 결과 리스트")
    public ApiResult<List<ExerciseSurveyResult>> getExerciseSurveyResultList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody ExerciseSurveyResult dto) {

    	Long acSeq = dto.getAccountSeq();
    	dto.setAccountSeq(acSeq);
        List<ExerciseSurveyResult> list = careTrackMapper.getExerciseSurveyResultList(dto);

        return new ApiResult<>(list);

    }      
    
    @PutMapping(path = "monitoring/account/updateAccountInfo")
    @Operation(summary = "사용자정보변경")
    public ApiResult<Boolean> updateAccountInfo(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody MonitorPatientRsp dto) {
        int processCnt = 0;
        Boolean chk = false;
    	
        Long doctorSeq = authentication.id.value();

    	String name = "";
    	try {
    		name = monitorMapper.getAccountInfo(dto.getSeq());
    		dto.setName(name);
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}

    	processCnt = monitorMapper.updateAccountInfo(dto);
        
    	chk = true;
        
        return new ApiResult<>(chk);

    }

    @GetMapping(path = "monitoring/account/{acSeq}")
    @Operation(summary = "환자 계정 상세 (관리자)")
    public ApiResult<MonitorPatientAccountDetailRsp> getPatientAccountDetail(
            @AuthenticationPrincipal JwtAuthentication authentication,
            @PathVariable Long acSeq) {
        Long doctorSeq = authentication.id.value();
        return new ApiResult<>(monitorPatientAccountService.getAccountDetail(doctorSeq, acSeq));
    }

    @PutMapping(path = "monitoring/account/updateEmail")
    @Operation(summary = "환자 이메일 변경 (관리자)")
    public ApiResult<Boolean> updatePatientEmail(
            @AuthenticationPrincipal JwtAuthentication authentication,
            @RequestBody MonitorPatientEmailUpdateRequest request) {
        Long doctorSeq = authentication.id.value();
        return new ApiResult<>(monitorPatientAccountService.updateEmail(doctorSeq, request));
    }

    @PutMapping(path = "monitoring/account/updatePassword")
    @Operation(summary = "환자 비밀번호 변경 (관리자)")
    public ApiResult<MonitorPatientPasswordUpdateResponse> updatePatientPassword(
            @AuthenticationPrincipal JwtAuthentication authentication,
            @RequestBody MonitorPatientPasswordUpdateRequest request) {
        Long doctorSeq = authentication.id.value();
        return new ApiResult<>(monitorPatientAccountService.updatePassword(doctorSeq, request));
    }
    
    @PostMapping(path = "monitoring/account/getSearchTextList")
    @Operation(summary = "사용자별 암정보 검색어 입력 리스트 ")
    public ApiResult<List<MonitorSearchDTO>> getSearchTextList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody MonitorSearchDTO dto) {
    	
        List<MonitorSearchDTO> list = monitorMapper.getSearchTextList(dto);

        return new ApiResult<>(list);

    }      
    
    @PostMapping(path = "monitoring/account/getAccountStatList")
    @Operation(summary = "평가지 리스트 ")
    public ApiResult<List<MonitorAcctStatDTO>> getAccountStatList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody MonitorAcctStatDTO dto) {
  	
        List<MonitorAcctStatDTO> list = monitorMapper.getAccountStatList(dto);

        return new ApiResult<>(list);

    }  
    
    @PostMapping(path = "monitoring/contents/getFavoriteStatList")
    @Operation(summary = "컨텐츠별 즐겨찾기 통계 리스트")
    public ApiResult<List<MonitorContentsDTO>> getFavoriteStatList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody MonitorContentsDTO dto) {
    	
    	String lang = "KO";
    	
    	if (dto.getLang() == null) dto.setLang(lang);
    	
        List<MonitorContentsDTO> list = monitorMapper.getFavoriteStatList(dto);

        return new ApiResult<>(list);

    }      
    
    @PostMapping(path = "monitoring/coaching/getUserCoachingMonitoringList")
    @Operation(summary = "사용자별 건강코칭 모니터링 리스트")
    public ApiResult<List<MonitorCoachingDTO>> getUserCoachingMonitoringList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody MonitorCoachingDTO dto) {

        Long doctorSeq = authentication.id.value();

        dto.setDSeq(doctorSeq);
        
        List<MonitorCoachingDTO> list = monitorMapper.getUserCoachingMonitoringList(dto);
        
        //System.out.println("doctorSeq => " + doctorSeq);
        //System.out.println("list => " + list.size());

        return new ApiResult<>(list);

    }

}

package com.cama.back.controller.track;


import com.cama.back.AppContext;
import com.cama.back.controller.doctor.MonitoringRestController;
import com.cama.back.domain.account.Account;
import com.cama.back.domain.account.AccountRecentNotification;
import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.contents.CmContentsCheck;
import com.cama.back.domain.contents.CmContentsLog;
import com.cama.back.domain.contents.LogType;
import com.cama.back.domain.track.TrackService;
import com.cama.back.domain.track.TrackStatus;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.account.ActiveHospitalRsp;
import com.cama.back.dto.admin.AdminAccountRsp;
import com.cama.back.dto.doctor.ContentsRsp;
import com.cama.back.dto.track.*;
import com.cama.back.exception.AlreadyTrackServiceException;
import com.cama.back.exception.TrackResponseException;
import com.cama.back.exception.account.AccountHospitalNotFoundException;
import com.cama.back.exception.contents.Contents2NotFoundException;
import com.cama.back.exception.contents.ContentsNotFoundException;
import com.cama.back.exception.track.CareTrackNotFoundException;
import com.cama.back.mapper.AccountMapper;
import com.cama.back.mapper.CareTrackMapper;
import com.cama.back.mapper.ContentsMapper;
import com.cama.back.repo.account.AccountNotificationRepository;
import com.cama.back.repo.contents.CmContentsCheckRepository;
import com.cama.back.repo.contents.CmContentsLogRepository;
import com.cama.back.repo.track.TrackServiceRepository;
import com.cama.back.security.JwtAuthentication;
import com.cama.back.service.track.CareTrackService;
import com.google.gson.reflect.TypeToken;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;
import net.gpedro.integrations.slack.SlackApi;
import net.gpedro.integrations.slack.SlackMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.Period;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api")
@Tag(name = "암정보 가이드 APIs")
@Slf4j
public class TrackRestController {

    private final CareTrackService careTrackService;
    private final TrackServiceRepository trackServiceRepository;
    private final CareTrackMapper careTrackMapper;
    private final ContentsMapper contentsMapper;
    private final CmContentsCheckRepository cmContentsCheckRepository;
    private final AccountNotificationRepository accountNotificationRepository;
    private final CmContentsLogRepository cmContentsLogRepository;
    private final AccountMapper accountMapper;

    @Value("${cama.slack.webhook-url:}")
    private String slackWebhookUrl;

    public TrackRestController(CareTrackService careTrackService, TrackServiceRepository trackServiceRepository,
                               CareTrackMapper careTrackMapper, ContentsMapper contentsMapper, CmContentsCheckRepository cmContentsCheckRepository,
                               AccountNotificationRepository accountNotificationRepository, CmContentsLogRepository cmContentsLogRepository, AccountMapper accountMapper) {
        this.careTrackService = careTrackService;
        this.trackServiceRepository = trackServiceRepository;
        this.careTrackMapper = careTrackMapper;
        this.contentsMapper = contentsMapper;
        this.cmContentsCheckRepository = cmContentsCheckRepository;
        this.accountNotificationRepository = accountNotificationRepository;
        this.cmContentsLogRepository = cmContentsLogRepository;
        this.accountMapper = accountMapper;
    }

    @PostMapping(path = "track/service")
    @Operation(summary = "암정보 가이드 신청")
    public ApiResult<Boolean> postCareTrack(@AuthenticationPrincipal JwtAuthentication authentication,
                                            @RequestBody TrackRequest dto) {

        Long acSeq = authentication.id.value();

        // 내가 신청한 병원 정보 찾기
        if (!accountMapper.getActiveHospital(acSeq).isPresent()) {
            throw new AccountHospitalNotFoundException();
        }

        ActiveHospitalRsp hospitalRsp = accountMapper.getActiveHospital(acSeq).get();
        Long hSeq = hospitalRsp.getSeq();

        if (trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq,
                hSeq, TrackStatus.ACTIVE, true).isPresent()) {
            throw new AlreadyTrackServiceException();
        }

        TrackResponse rsp = careTrackService.callTrackService(hSeq, acSeq, dto.getDiseaseSeq(), dto.getDays(), dto.getInterest(),
                dto.getDiseases().getDiseaseOption(), dto.getDiseases().getDiseaseTreatment());

        if (!"200".equals(rsp != null ? rsp.getCode() : null)) {
            throw new TrackResponseException();
        }

        trackServiceRepository.save(TrackService.builder()
                .accountSeq(acSeq)
                .hospitalSeq(hSeq)
                .days(dto.getDays())
                .diseaseSeq(dto.getDiseaseSeq())
                .disease(dto.getDiseases())
                .interest(AppContext.GSON.toJson(dto.getInterest()))
                .data(AppContext.GSON.toJson(rsp.getTrack()))
                .status(TrackStatus.ACTIVE)
                .enabled(true)
                .build());

        accountNotificationRepository.save(AccountRecentNotification.builder()
                .accountSeq(acSeq)
                .message("암정보 가이드 설정이 완료 되었습니다.")
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PostMapping(path = "webview/track/service")
    @Operation(summary = "암정보 가이드 신청")
    public ApiResult<Boolean> postWebviewCareTrack(@AuthenticationPrincipal JwtAuthentication authentication,
                                            @RequestBody TrackRequest dto) {

        Long acSeq = dto.getAcSeq();

        // 내가 신청한 병원 정보 찾기
        if (!accountMapper.getActiveHospital(acSeq).isPresent()) {
            throw new AccountHospitalNotFoundException();
        }

        ActiveHospitalRsp hospitalRsp = accountMapper.getActiveHospital(acSeq).get();
        Long hSeq = hospitalRsp.getSeq();

        if (trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq,
                hSeq, TrackStatus.ACTIVE, true).isPresent()) {
            throw new AlreadyTrackServiceException();
        }

        TrackResponse rsp = careTrackService.callTrackService(hSeq, acSeq, dto.getDiseaseSeq(), dto.getDays(), dto.getInterest(),
                dto.getDiseases().getDiseaseOption(), dto.getDiseases().getDiseaseTreatment());

        if (!"200".equals(rsp != null ? rsp.getCode() : null)) {
            throw new TrackResponseException();
        }

        trackServiceRepository.save(TrackService.builder()
                .accountSeq(acSeq)
                .hospitalSeq(hSeq)
                .days(dto.getDays())
                .diseaseSeq(dto.getDiseaseSeq())
                .disease(dto.getDiseases())
                .interest(AppContext.GSON.toJson(dto.getInterest()))
                .data(AppContext.GSON.toJson(rsp.getTrack()))
                .status(TrackStatus.ACTIVE)
                .enabled(true)
                .build());

        accountNotificationRepository.save(AccountRecentNotification.builder()
                .accountSeq(acSeq)
                .message("암정보 가이드 설정이 완료 되었습니다.")
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }


    @PostMapping(path = "track/service/cancel")
    @Operation(summary = "암정보 가이드 신청취소")
    public ApiResult<Boolean> postCareTrackCancel(@AuthenticationPrincipal JwtAuthentication authentication,
                                                  @RequestBody TrackCancelRequest dto) {

        Long acSeq = authentication.id.value();

        if (!trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq,
                dto.getHospitalSeq(), TrackStatus.ACTIVE, true).isPresent()) {
            throw new CareTrackNotFoundException();
        }

        TrackService trackService = trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq,
                dto.getHospitalSeq(), TrackStatus.ACTIVE, true).get();

        trackService.setStatus(TrackStatus.CANCEL);
        trackServiceRepository.save(trackService);

        accountNotificationRepository.save(AccountRecentNotification.builder()
                .accountSeq(acSeq)
                .message("암정보 가이드 신청이 취소 되었습니다.")
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PostMapping(path = "webview/track/service/cancel")
    @Operation(summary = "암정보 가이드 신청취소")
    public ApiResult<Boolean> postWebviewCareTrackCancel(@AuthenticationPrincipal JwtAuthentication authentication,
                                                  @RequestBody TrackCancelRequest dto) {

        Long acSeq = dto.getAcSeq();

        if (!trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq,
                dto.getHospitalSeq(), TrackStatus.ACTIVE, true).isPresent()) {
            throw new CareTrackNotFoundException();
        }

        TrackService trackService = trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq,
                dto.getHospitalSeq(), TrackStatus.ACTIVE, true).get();

        trackService.setStatus(TrackStatus.CANCEL);
        trackServiceRepository.save(trackService);

        accountNotificationRepository.save(AccountRecentNotification.builder()
                .accountSeq(acSeq)
                .message("암정보 가이드 신청이 취소 되었습니다.")
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PostMapping(path = "track/service/info")
    @Operation(summary = "암정보 가이드 정보")
    public ApiResult<List<ContentsRsp>> getCareTrackInfo(@AuthenticationPrincipal JwtAuthentication authentication,
                                                         @RequestBody TrackInfoRequest dto) {

        Long acSeq = authentication.id.value();

        TrackDataRsp careTrackData = careTrackMapper.getCareTrackData(acSeq, dto.getHospitalSeq(), dto.getDiseaseSeq(), dto.getDay());

        List<Long> contents = AppContext.GSON.fromJson(careTrackData.getJsonData(), new TypeToken<List<Long>>() {
        }.getType());

        if (contents == null) {
            notifyMissingCareTrackContents(dto, acSeq);
            throw new Contents2NotFoundException();
        }

        List<ContentsRsp> collect = contents.stream().map(cSeq -> {


            if (!contentsMapper.getTrackContentsNatureDetail(cSeq, acSeq, careTrackData.getTrackServiceSeq()).isPresent()) {
                throw new ContentsNotFoundException();
            }

            ContentsRsp contentsRsp = contentsMapper.getTrackContentsNatureDetail(cSeq, acSeq, careTrackData.getTrackServiceSeq()).get();
            contentsRsp.setRemoved(!contentsRsp.isEnabled());

            return contentsRsp;

        }).collect(Collectors.toList());

        return new ApiResult<>(collect);

    }
    
    @PostMapping(path = "webview/track/service/info")
    @Operation(summary = "암정보 가이드 정보")
    public ApiResult<List<ContentsRsp>> getWebviewCareTrackInfo(@AuthenticationPrincipal JwtAuthentication authentication,
                                                         @RequestBody TrackInfoRequest dto) {

        Long acSeq = dto.getAcSeq();

        TrackDataRsp careTrackData = careTrackMapper.getCareTrackData(acSeq, dto.getHospitalSeq(), dto.getDiseaseSeq(), dto.getDay());

        List<Long> contents = AppContext.GSON.fromJson(careTrackData.getJsonData(), new TypeToken<List<Long>>() {
        }.getType());

        if (contents == null) {
            notifyMissingCareTrackContents(dto, acSeq);
            throw new Contents2NotFoundException();
        }

        List<ContentsRsp> collect = contents.stream().map(cSeq -> {


            if (!contentsMapper.getTrackContentsNatureDetail(cSeq, acSeq, careTrackData.getTrackServiceSeq()).isPresent()) {
                throw new ContentsNotFoundException();
            }

            ContentsRsp contentsRsp = contentsMapper.getTrackContentsNatureDetail(cSeq, acSeq, careTrackData.getTrackServiceSeq()).get();
            contentsRsp.setRemoved(!contentsRsp.isEnabled());

            return contentsRsp;

        }).collect(Collectors.toList());

        return new ApiResult<>(collect);

    }
   
    @GetMapping(path = "track/service")
    @Operation(summary = "암정보 가이드 신청정보")
    public ApiResult<TrackServiceRsp> getCareTrackInfo(@AuthenticationPrincipal JwtAuthentication authentication) {

        Long acSeq = authentication.id.value();

        // 내가 신청한 병원 정보 찾기
        if (!accountMapper.getActiveHospital(acSeq).isPresent()) {
            throw new AccountHospitalNotFoundException();
        }

        ActiveHospitalRsp hospitalRsp = accountMapper.getActiveHospital(acSeq).get();
        Long hSeq = hospitalRsp.getSeq();

        if (!trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, hSeq, TrackStatus.ACTIVE, true).isPresent()) {
            return new ApiResult<>(null);
        }

        if (!careTrackMapper.getApplyCareTrackInfo(acSeq, hSeq).isPresent()) {
            return new ApiResult<>(null);
        }

        TrackServiceRsp trackServiceRsp = careTrackMapper.getApplyCareTrackInfo(acSeq, hSeq).get();

        //Long days = trackServiceRsp.getDays();

//        Map<String, List<Long>> nMap = AppContext.GSON.fromJson(trackServiceRsp.getData(), new TypeToken<Map<String, List<Long>>>() {
//        }.getType());
//
//        List<Long> contents = new ArrayList<>();
//        for (String key : nMap.keySet()) {
//            contents.addAll(nMap.get(key));
//        }
//
//        int contentsProcess = 0;
//        for (Long cSeq : contents) {
//            int p = careTrackMapper.getCareTrackContentsDoneCount(acSeq, trackServiceRsp.getSeq(), cSeq);
//            //System.out.println(cSeq + " < " + trackServiceRsp.getSeq() + " > " + contentsProcess);
//            contentsProcess += p;
//        }
//
//        double process = (double) contentsProcess / trackServiceRsp.getDays();
//
//        trackServiceRsp.setProcess(process);


        double process = Double.parseDouble(String.format("%.2f", trackServiceRsp.getProcess()));
        trackServiceRsp.setProcess(process);

        return new ApiResult<>(trackServiceRsp);

    }
    
    @PostMapping(path = "webview/track/service/request/info")
    @Operation(summary = "암정보 가이드 신청정보")
    public ApiResult<TrackServiceRsp> getCareTrackRequestInfo(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody TrackInfoRequest dto) {

        Long acSeq = dto.getAcSeq();

        // 내가 신청한 병원 정보 찾기
        if (!accountMapper.getActiveHospital(acSeq).isPresent()) {
            throw new AccountHospitalNotFoundException();
        }

        ActiveHospitalRsp hospitalRsp = accountMapper.getActiveHospital(acSeq).get();
        Long hSeq = hospitalRsp.getSeq();

        if (!trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, hSeq, TrackStatus.ACTIVE, true).isPresent()) {
            return new ApiResult<>(null);
        }

        if (!careTrackMapper.getApplyCareTrackInfo(acSeq, hSeq).isPresent()) {
            return new ApiResult<>(null);
        }

        TrackServiceRsp trackServiceRsp = careTrackMapper.getApplyCareTrackInfo(acSeq, hSeq).get();

        //Long days = trackServiceRsp.getDays();

//        Map<String, List<Long>> nMap = AppContext.GSON.fromJson(trackServiceRsp.getData(), new TypeToken<Map<String, List<Long>>>() {
//        }.getType());
//
//        List<Long> contents = new ArrayList<>();
//        for (String key : nMap.keySet()) {
//            contents.addAll(nMap.get(key));
//        }
//
//        int contentsProcess = 0;
//        for (Long cSeq : contents) {
//            int p = careTrackMapper.getCareTrackContentsDoneCount(acSeq, trackServiceRsp.getSeq(), cSeq);
//            //System.out.println(cSeq + " < " + trackServiceRsp.getSeq() + " > " + contentsProcess);
//            contentsProcess += p;
//        }
//
//        double process = (double) contentsProcess / trackServiceRsp.getDays();
//
//        trackServiceRsp.setProcess(process);


        double process = Double.parseDouble(String.format("%.2f", trackServiceRsp.getProcess()));
        trackServiceRsp.setProcess(process);

        return new ApiResult<>(trackServiceRsp);

    }

    @PutMapping(path = "track/service/progress")
    @Operation(summary = "암정보 가이드 진도율 업데이트")
    public ApiResult<Boolean> putCareTrackProgress(@AuthenticationPrincipal JwtAuthentication authentication,
                                                   @RequestBody ProgressRequest dto) {

        Long acSeq = authentication.id.value();
        Long progress = 100L;
        
        /*
        if (dto.getProgress() < 0) {
        	progress = 100L;
        } else {
        	progress = dto.getProgress();
        }*/

        if (!cmContentsCheckRepository.findByAccountSeqAndTrackServiceSeqAndContentsSeqAndEnabled(acSeq, dto.getTrackServiceSeq(), dto.getContentsSeq(), true).isPresent()) {
            cmContentsCheckRepository.save(CmContentsCheck.builder()
                    .accountSeq(acSeq)
                    .trackServiceSeq(dto.getTrackServiceSeq())
                    .contentsSeq(dto.getContentsSeq())
                    .progress(progress)
                    .enabled(true)
                    .build());
        } else {

            CmContentsCheck ccc = cmContentsCheckRepository.findByAccountSeqAndTrackServiceSeqAndContentsSeqAndEnabled(acSeq, dto.getTrackServiceSeq(), dto.getContentsSeq(), true).get();

            if (ccc.getProgress() < dto.getProgress()) {
                if (0 < dto.getProgress() && dto.getProgress() <= 100) {
                    ccc.setProgress(progress);
                    cmContentsCheckRepository.save(ccc);
                }
            }

        }

        cmContentsLogRepository.save(CmContentsLog.builder()
                .logType(LogType.SERVICE_ON)
                .contentsSeq(dto.getContentsSeq())
                .accountSeq(acSeq)
                .progress(progress)
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PutMapping(path = "webview/track/service/progress")
    @Operation(summary = "암정보 가이드 진도율 업데이트")
    public ApiResult<Boolean> putWebviewCareTrackProgress(@AuthenticationPrincipal JwtAuthentication authentication,
                                                   @RequestBody ProgressRequest dto) {

        Long acSeq = dto.getAcSeq();
        Long progress = 100L;
        
        /*
        if (dto.getProgress() < 0) {
        	progress = 100L;
        } else {
        	progress = dto.getProgress();
        }*/

        if (!cmContentsCheckRepository.findByAccountSeqAndTrackServiceSeqAndContentsSeqAndEnabled(acSeq, dto.getTrackServiceSeq(), dto.getContentsSeq(), true).isPresent()) {
            cmContentsCheckRepository.save(CmContentsCheck.builder()
                    .accountSeq(acSeq)
                    .trackServiceSeq(dto.getTrackServiceSeq())
                    .contentsSeq(dto.getContentsSeq())
                    .progress(progress)
                    .enabled(true)
                    .build());
        } else {

            CmContentsCheck ccc = cmContentsCheckRepository.findByAccountSeqAndTrackServiceSeqAndContentsSeqAndEnabled(acSeq, dto.getTrackServiceSeq(), dto.getContentsSeq(), true).get();

            if (ccc.getProgress() < dto.getProgress()) {
                if (0 < dto.getProgress() && dto.getProgress() <= 100) {
                    ccc.setProgress(progress);
                    cmContentsCheckRepository.save(ccc);
                }
            }

        }

        cmContentsLogRepository.save(CmContentsLog.builder()
                .logType(LogType.SERVICE_ON)
                .contentsSeq(dto.getContentsSeq())
                .accountSeq(acSeq)
                .progress(progress)
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PutMapping(path = "track/service/guest/progress")
    @Operation(summary = "암정보 가이드 진도율 업데이트(비회원)")
    public ApiResult<Boolean> putCareTrackGuestProgress(@AuthenticationPrincipal JwtAuthentication authentication,
                                                        @RequestBody ProgressRequest dto) {
        Long progress = 100L;
        
        /*
        if (dto.getProgress() < 0) {
        	progress = 100L;
        } else {
        	progress = dto.getProgress();
        }*/

        cmContentsLogRepository.save(CmContentsLog.builder()
                .contentsSeq(dto.getContentsSeq())
                .logType(LogType.GUEST)
                .progress(progress)
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PutMapping(path = "webview/track/service/guest/progress")
    @Operation(summary = "암정보 가이드 진도율 업데이트(비회원)")
    public ApiResult<Boolean> putWebviewCareTrackGuestProgress(@AuthenticationPrincipal JwtAuthentication authentication,
                                                        @RequestBody ProgressRequest dto) {
        Long progress = 100L;
        
        /*
        if (dto.getProgress() < 0) {
        	progress = 100L;
        } else {
        	progress = dto.getProgress();
        }*/

        cmContentsLogRepository.save(CmContentsLog.builder()
                .contentsSeq(dto.getContentsSeq())
                .logType(LogType.GUEST)
                .progress(progress)
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PutMapping(path = "track/service/off/progress")
    @Operation(summary = "암정보 가이드 진도율 업데이트(서비스 전)")
    public ApiResult<Boolean> putCareTrackOffProgress(@AuthenticationPrincipal JwtAuthentication authentication,
                                                      @RequestBody ProgressRequest dto) {

        Long acSeq = authentication.id.value();
        Long progress = 100L;
        /*
        if (dto.getProgress() < 0) {
        	progress = 100L;
        } else {
        	progress = dto.getProgress();
        }*/

        cmContentsLogRepository.save(CmContentsLog.builder()
                .contentsSeq(dto.getContentsSeq())
                .accountSeq(acSeq)
                .logType(LogType.SERVICE_OFF)
                .progress(progress)
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PutMapping(path = "webview/track/service/off/progress")
    @Operation(summary = "암정보 가이드 진도율 업데이트(서비스 전)")
    public ApiResult<Boolean> putWebviewCareTrackOffProgress(@AuthenticationPrincipal JwtAuthentication authentication,
                                                      @RequestBody ProgressRequest dto) {

        Long acSeq = authentication.id.value();
        Long progress = 100L;
        /*
        if (dto.getProgress() < 0) {
        	progress = 100L;
        } else {
        	progress = dto.getProgress();
        }*/

        cmContentsLogRepository.save(CmContentsLog.builder()
                .contentsSeq(dto.getContentsSeq())
                .accountSeq(acSeq)
                .logType(LogType.SERVICE_OFF)
                .progress(progress)
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }


    @GetMapping(path = "track/service/check")
    @Operation(summary = "암정보 가이드 신청확인")
    public ApiResult<Boolean> getCareTrackCheck(@AuthenticationPrincipal JwtAuthentication authentication) {

        Long acSeq = authentication.id.value();

        // 내가 신청한 병원 정보 찾기
        if (!accountMapper.getActiveHospital(acSeq).isPresent()) {
            throw new AccountHospitalNotFoundException();
        }

        ActiveHospitalRsp hospitalRsp = accountMapper.getActiveHospital(acSeq).get();
        Long hSeq = hospitalRsp.getSeq();

        if (!trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, hSeq, TrackStatus.ACTIVE, true).isPresent()) {
            return new ApiResult<>(false);
        } else {

            TrackService trackService = trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, hSeq, TrackStatus.ACTIVE, true).get();

            Period diff = Period.between(trackService.getCreatedAt().toLocalDate(), LocalDate.now(ZoneId.of("Asia/Seoul")));
            int days = diff.getDays();
            //log.info("trackService.getDays() => {}", trackService.getDays());
            //log.info("diff => {}", diff);
            //log.info("days => {}", days);
            if (trackService.getDays() < days) {

                trackService.setStatus(TrackStatus.CANCEL);
                trackServiceRepository.save(trackService);

                //log.info("trackService.getStatus => {}", trackService.getStatus());
                return new ApiResult<>(false);

            }
            return new ApiResult<>(true);
        }

    }
    
    @PostMapping(path = "webview/track/service/check")
    @Operation(summary = "암정보 가이드 신청확인")
    public ApiResult<Boolean> getWebviewCareTrackCheck(@AuthenticationPrincipal JwtAuthentication authentication, 
    		@RequestBody Account dto) {

        Long acSeq = dto.getSeq();

        // 내가 신청한 병원 정보 찾기
        if (!accountMapper.getActiveHospital(acSeq).isPresent()) {
            throw new AccountHospitalNotFoundException();
        }

        ActiveHospitalRsp hospitalRsp = accountMapper.getActiveHospital(acSeq).get();
        Long hSeq = hospitalRsp.getSeq();

        if (!trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, hSeq, TrackStatus.ACTIVE, true).isPresent()) {
            return new ApiResult<>(false);
        } else {

            TrackService trackService = trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, hSeq, TrackStatus.ACTIVE, true).get();

            Period diff = Period.between(trackService.getCreatedAt().toLocalDate(), LocalDate.now(ZoneId.of("Asia/Seoul")));
            int days = diff.getDays();
            //log.info("trackService.getDays() => {}", trackService.getDays());
            //log.info("diff => {}", diff);
            //log.info("days => {}", days);
            if (trackService.getDays() < days) {

                trackService.setStatus(TrackStatus.CANCEL);
                trackServiceRepository.save(trackService);

                //log.info("trackService.getStatus => {}", trackService.getStatus());
                return new ApiResult<>(false);

            }
            return new ApiResult<>(true);
        }

    }

    @PostMapping(path = "track/service/done")
    @Operation(summary = "암정보 가이드 완료 확인")
    public ApiResult<List<TrackDoneRsp>> getCareTrackDone(@AuthenticationPrincipal JwtAuthentication authentication,
                                                          @RequestBody TrackInfoRequest dto) {

        Long acSeq = authentication.id.value();

        List<TrackDoneRsp> list = new ArrayList<>();

        for (long i = dto.getDay(); i > 0; i--) {

            TrackDataRsp careTrackData = careTrackMapper.getCareTrackData(acSeq, dto.getHospitalSeq(), dto.getDiseaseSeq(), i);
            List<Long> contents = AppContext.GSON.fromJson(careTrackData.getJsonData(), new TypeToken<List<Long>>() {
            }.getType());


            if (!trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, dto.getHospitalSeq(), TrackStatus.ACTIVE, true).isPresent()) {
                throw new CareTrackNotFoundException();
            }

            TrackService ts = trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, dto.getHospitalSeq(), TrackStatus.ACTIVE, true).get();

            int trackSize;
            int doneCount = 0;

            if (contents != null) {
                trackSize = contents.size();
                if (trackSize > 0) {
                    for (Long cSeq : contents) {
                        doneCount += careTrackMapper.getCareTrackContentsDoneCount(acSeq, ts.getSeq(), cSeq);
                    }

                    list.add(TrackDoneRsp.builder()
                            .day(i)
                            .progress(((long) doneCount * 100 / trackSize))
                            .build());
                } else {
                    list.add(TrackDoneRsp.builder()
                            .day(i)
                            .progress(0L)
                            .build());
                }

            }


        }

        return new ApiResult<>(list);

    }


    @PostMapping(path = "webview/track/service/done")
    @Operation(summary = "암정보 가이드 완료 확인")
    public ApiResult<List<TrackDoneRsp>> getWebviewCareTrackDone(@AuthenticationPrincipal JwtAuthentication authentication,
                                                          @RequestBody TrackInfoRequest dto) {

        Long acSeq = dto.getAcSeq();

        List<TrackDoneRsp> list = new ArrayList<>();

        for (long i = dto.getDay(); i > 0; i--) {

            TrackDataRsp careTrackData = careTrackMapper.getCareTrackData(acSeq, dto.getHospitalSeq(), dto.getDiseaseSeq(), i);
            List<Long> contents = AppContext.GSON.fromJson(careTrackData.getJsonData(), new TypeToken<List<Long>>() {
            }.getType());


            if (!trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, dto.getHospitalSeq(), TrackStatus.ACTIVE, true).isPresent()) {
                throw new CareTrackNotFoundException();
            }

            TrackService ts = trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, dto.getHospitalSeq(), TrackStatus.ACTIVE, true).get();

            int trackSize;
            int doneCount = 0;

            if (contents != null) {
                trackSize = contents.size();
                if (trackSize > 0) {
                    for (Long cSeq : contents) {
                        doneCount += careTrackMapper.getCareTrackContentsDoneCount(acSeq, ts.getSeq(), cSeq);
                    }

                    list.add(TrackDoneRsp.builder()
                            .day(i)
                            .progress(((long) doneCount * 100 / trackSize))
                            .build());
                } else {
                    list.add(TrackDoneRsp.builder()
                            .day(i)
                            .progress(0L)
                            .build());
                }

            }


        }

        return new ApiResult<>(list);

    }
    
    @PostMapping(path = "track/service/stepList")
    @Operation(summary = "암정보 가이드 걸음 정보 리스트")
    public ApiResult<List<StepRequest>> getStepInfoList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody StepRequest dto) {

    	Long acSeq = authentication.id.value();
    	dto.setAccountSeq(acSeq);
        List<StepRequest> list = careTrackMapper.getCareTrackStepList(dto);

        return new ApiResult<>(list);

    }

    
    @PostMapping(path = "webview/track/service/stepList")
    @Operation(summary = "암정보 가이드 걸음 정보 리스트")
    public ApiResult<List<StepRequest>> getWebviewStepInfoList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody StepRequest dto) {

    	Long acSeq = dto.getAccountSeq();
    	dto.setAccountSeq(acSeq);
        List<StepRequest> list = careTrackMapper.getCareTrackStepList(dto);

        return new ApiResult<>(list);

    }
    
    @PutMapping(path = "track/service/step")
    @Operation(summary = "암정보 가이드 걸음 업데이트")
    public ApiResult<Boolean> putCareTracStep(@AuthenticationPrincipal JwtAuthentication authentication,
                                                   @RequestBody StepRequest dto) {

        Long acSeq = authentication.id.value();
        dto.setAccountSeq(acSeq);
        
        careTrackMapper.saveCareTrackStepInfo(dto);
        
        return new ApiResult<>(true);

    }  
    
    @PutMapping(path = "webview/track/service/step")
    @Operation(summary = "암정보 가이드 걸음 업데이트")
    public ApiResult<Boolean> putWebviewCareTracStep(@AuthenticationPrincipal JwtAuthentication authentication,
                                                   @RequestBody StepRequest dto) {

        Long acSeq = dto.getAccountSeq();
        dto.setAccountSeq(acSeq);
        
        careTrackMapper.saveCareTrackStepInfo(dto);
        
        return new ApiResult<>(true);

    }

    private void notifyMissingCareTrackContents(TrackInfoRequest dto, Long acSeq) {
        if (slackWebhookUrl == null || slackWebhookUrl.isBlank()) {
            log.warn(
                    "Missing care track contents (Slack not configured): day={}, disease={}, hospital={}, acSeq={}",
                    dto.getDay(), dto.getDiseaseSeq(), dto.getHospitalSeq(), acSeq);
            return;
        }
        try {
            SlackApi alert = new SlackApi(slackWebhookUrl);
            alert.call(new SlackMessage(
                    "day -> " + dto.getDay() + ", disease -> " + dto.getDiseaseSeq()
                            + ", Hospital -> " + dto.getHospitalSeq() + ", acSeq -> " + acSeq));
        } catch (Exception e) {
            log.warn("Slack notify failed: {}", e.getMessage());
        }
    }
}

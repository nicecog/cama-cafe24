package com.cama.back.controller.coaching;

import static java.time.temporal.ChronoUnit.DAYS;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;


import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.coaching.CoachingExerciseSurveyResultHst;
import com.cama.back.domain.contents.CmContentsVideo;
import com.cama.back.domain.schedule.AccountBatchSchedule;
import com.cama.back.domain.schedule.AccountSchedule;
import com.cama.back.domain.schedule.ScheduleType;
import com.cama.back.dto.coaching.CodeInfo;
import com.cama.back.dto.coaching.QuestionDetailInfo;
import com.cama.back.dto.coaching.QuestionInfo;
import com.cama.back.dto.coaching.SurveyResult;
import com.cama.back.dto.coaching.UserAnswerInfo;
import com.cama.back.dto.coaching.ExerciseUserClassInfo;
import com.cama.back.dto.coaching.ExerciseContentInfo;
import com.cama.back.dto.coaching.ExerciseSurveyResult;
import com.cama.back.dto.track.StepRequest;
import com.cama.back.exception.account.AccountNotFoundException;
import com.cama.back.mapper.CareTrackMapper;
import com.cama.back.mapper.CoachingMapper;
import com.cama.back.mapper.ContentsMapper;
import com.cama.back.mapper.ScheduleMapper;
import com.cama.back.repo.coaching.ExerciseSurveyResultRepository;
import com.cama.back.repo.schedule.BatchScheduleRepository;
import com.cama.back.repo.schedule.ScheduleRepository;
import com.cama.back.security.JwtAuthentication;
import com.cama.back.dto.schedule.ScheduleRequest;

import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api")
@Tag(name = "건강코 APIs")
public class CoachingRestController {

    private final CoachingMapper coachingMapper;
    private final ContentsMapper contentsMapper;
    private final CareTrackMapper careTrackMapper;
    private final ExerciseSurveyResultRepository exerciseSurveyResultRepository;
    private final ScheduleRepository scheduleRepository;
    private final ScheduleMapper scheduleMapper;
    private final BatchScheduleRepository batchScheduleRepository;

    public CoachingRestController(CoachingMapper coachingMapper,ContentsMapper contentsMapper,CareTrackMapper careTrackMapper
    		, ExerciseSurveyResultRepository exerciseSurveyResultRepository
    		, ScheduleRepository scheduleRepository, ScheduleMapper scheduleMapper, BatchScheduleRepository batchScheduleRepository) {
        this.coachingMapper = coachingMapper;
        this.contentsMapper = contentsMapper;
        this.careTrackMapper = careTrackMapper;
        this.exerciseSurveyResultRepository = exerciseSurveyResultRepository;
        this.scheduleRepository = scheduleRepository;
        this.scheduleMapper = scheduleMapper;
        this.batchScheduleRepository = batchScheduleRepository;
    }

    @PostMapping(path = "coaching/service/codeList")
    @Operation(summary = "건강코칭 코드 정보 리스트")
    public ApiResult<List<CodeInfo>> getCodeInfoList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody CodeInfo dto) {
    	
        List<CodeInfo> list = coachingMapper.getCodeInfoList(dto.getCode(), dto.getCd());

        return new ApiResult<>(list);

    }

    @PostMapping(path = "coaching/service/questionInfoList")
    @Operation(summary = "건강코칭 질문 정보 리스트")
    public ApiResult<List<QuestionInfo>> getQuestionInfoList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody QuestionInfo dto) {
    	
    	int accountSeq = 0;
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}

        List<QuestionInfo> list = coachingMapper.getQuestionInfoList(accountSeq
        		                                                   , dto.getCategoryCd()
        		                                                   , dto.getStepDayCd()
        		                                                   , dto.getProgressTypeCd()
        		                                                   , dto.getAnswerTypeCd());

        return new ApiResult<>(list);

    }
    
    @PostMapping(path = "coaching/service/questionDetailInfoList")
    @Operation(summary = "건강코칭 질문 상세 정보 리스트")
    public ApiResult<List<QuestionDetailInfo>> getQuestionDetailInfoList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody QuestionDetailInfo dto) {
    	
    	int accountSeq = 0;
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}
    	
        List<QuestionDetailInfo> list = coachingMapper.getQuestionDetailInfoList(accountSeq
        		                                                               , dto.getCategoryCd()
        		                                                               , dto.getStepDayCd()
        		                                                               , dto.getProgressTypeCd()
        		                                                               , dto.getDetailSeq());

        return new ApiResult<>(list);

    }
    
    
    @PostMapping(path = "coaching/service/userAnswerInfoList")
    @Operation(summary = "사용자별 답변 정보 리스트")
    public ApiResult<List<UserAnswerInfo>> getUserAnswerInfoList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody UserAnswerInfo dto) {

    	int accountSeq = 0;
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}
    	
         List<UserAnswerInfo> list = coachingMapper.getUserAnswerInfoList(accountSeq
                                                                        , dto.getCategoryCd()
                                                                        , dto.getStepDayCd()
                                                                        , dto.getProgressTypeCd()
                                                                        , dto.getAnswerChoiceSeq());

        return new ApiResult<>(list);

    }

    @PutMapping(path = "coaching/service/answer")
    @Operation(summary = "질문 답변 저장")
    public ApiResult<Boolean> putUserAnswerInfo(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody UserAnswerInfo dto) {
        int existCnt = 0;
        int processCnt = 0;
        Boolean chk = true;
        
    	int accountSeq = 0;
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}
        		
        existCnt = coachingMapper.getAnswerCnt(accountSeq
                                             , dto.getCategoryCd()
                                             , dto.getStepDayCd()
                                             , dto.getProgressTypeCd()
                                             , dto.getAnswerChoiceSeq()
                                             );
        
        if ( existCnt > 0) {
        	processCnt = coachingMapper.updateAnswer(accountSeq
                                                   , dto.getCategoryCd()
                                                   , dto.getStepDayCd()
                                                   , dto.getProgressTypeCd()
                                                   , dto.getAnswerChoiceSeq()
                                                   , dto.getAnswerChoice()
                                                   , dto.getRefVal1()
                                                   , dto.getRefVal2()
                                                   , dto.getRefVal3()
                                                   , dto.getRefVal4()
                                                   , dto.getRefVal5()
                                                   );
        } else {
        	processCnt = coachingMapper.insertAnswer(accountSeq
                                                   , dto.getCategoryCd()
                                                   , dto.getStepDayCd()
                                                   , dto.getProgressTypeCd()
                                                   , dto.getAnswerChoiceSeq()
                                                   , dto.getAnswerChoice()
                                                   , dto.getRefVal1()
                                                   , dto.getRefVal2()
                                                   , dto.getRefVal3()
                                                   , dto.getRefVal4()
                                                   , dto.getRefVal5());
        }
        
        //운동 콘텐츠 진도 결과 
        saveExerciseProgressHst(accountSeq, dto);
        
        if (processCnt > 0 ) chk = true;
        else chk = false;
        
        return new ApiResult<>(chk);

    }
    
    //운동 콘텐츠 진도 결과 
    public void saveExerciseProgressHst (int accountSeq, UserAnswerInfo dto) {
    	int processCnt = 0;
    	int surveySeq  = 0;
    	//설문Seq 추출
    	surveySeq = coachingMapper.getSurveySeq(accountSeq);
    	
    	// 설문결과 존재 하면 
    	if (surveySeq > 0) {
    	  //해당건 delete
    	  processCnt = coachingMapper.deleteExerciseProgressResult(accountSeq, surveySeq, dto.getAnswerChoiceSeq());
    			
    	  //해당건 insert
    	  processCnt = coachingMapper.insertExerciseProgressResult(accountSeq, surveySeq, dto.getAnswerChoiceSeq());
    	}
    }

    @PutMapping(path = "coaching/service/answerList")
    @Operation(summary = "질문 답변 다건 저장")
    public ApiResult<Boolean> putUserAnswerInfList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody List<UserAnswerInfo> dtoList) {
        int processCnt = 0;
        Boolean chk = true;
        int i = 0;
        int accountSeq = 0;
        
        for (UserAnswerInfo dto : dtoList) {
        	if (i == 0) {
                try {
            	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
            	} catch (Exception e) {
            		throw new AccountNotFoundException();
            	}
                if (("Y").equals(dto.getAnswerAddChoieYn())) {
                	processCnt = coachingMapper.deleteAddAnswer(accountSeq
                                                              , dto.getCategoryCd()
                                                              , dto.getStepDayCd());
                } else {
                	processCnt = coachingMapper.deleteAnswer(accountSeq
                                                           , dto.getCategoryCd()
                                                           , dto.getStepDayCd());
                }
        	}
        	
            if (("Y").equals(dto.getAnswerAddChoieYn())) {
        	    processCnt = coachingMapper.insertAddAnswer(accountSeq
                                                          , dto.getCategoryCd()
                                                          , dto.getStepDayCd()
                                                          , dto.getProgressTypeCd()
                                                          , dto.getAnswerChoiceSeq()
                                                          , dto.getAnswerChoice()
                                                          , dto.getRefVal1()
                                                          , dto.getRefVal2()
                                                          , dto.getRefVal3()
                                                          , dto.getRefVal4()
                                                          , dto.getRefVal5());
            } else {
        	    processCnt = coachingMapper.insertAnswer(accountSeq
                                                       , dto.getCategoryCd()
                                                       , dto.getStepDayCd()
                                                       , dto.getProgressTypeCd()
                                                       , dto.getAnswerChoiceSeq()
                                                       , dto.getAnswerChoice()
                                                       , dto.getRefVal1()
                                                       , dto.getRefVal2()
                                                       , dto.getRefVal3()
                                                       , dto.getRefVal4()
                                                       , dto.getRefVal5());
            }
        	
        	i = i + 1;
        	
        	//운동 콘텐츠 진도 결과 
            saveExerciseProgressHst(accountSeq, dto);
        }
        
        if (i > 0 ) chk = true;
        else chk = false;
        
        return new ApiResult<>(true);

    }    
    
    @PostMapping(path = "coaching/service/getCoachingProgressList")
    @Operation(summary = "카테고리별 진도")
    public ApiResult<List<UserAnswerInfo>> getCoachingProgressList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody UserAnswerInfo dto) {

    	int accountSeq = 0;
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}
    	
         List<UserAnswerInfo> list = coachingMapper.getCoachingProgressList(accountSeq);

        return new ApiResult<>(list);

    }   
    
    @PostMapping(path = "webview/coaching/service/getCoachingProgressList")
    @Operation(summary = "카테고리별 진도")
    public ApiResult<List<UserAnswerInfo>> getWebviewCoachingProgressList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody UserAnswerInfo dto) {

    	int accountSeq = 0;
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}
    	
         List<UserAnswerInfo> list = coachingMapper.getCoachingProgressList(accountSeq);

        return new ApiResult<>(list);

    }   
   
    @PostMapping(path = "coaching/service/getCmVideoInfoList")
    @Operation(summary = "건강코칭 유튜브 정보 리스트")
    public ApiResult<List<CmContentsVideo>> getCmVideoInfoList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody CmContentsVideo dto) {
    	
    	int accountSeq = 0;
    	
    	String lang = "KO";
    	
    	if (dto.getLang() == null) dto.setLang(lang);
    	
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}
    	
        List<CmContentsVideo> list = contentsMapper.getCmVideoInfoList(dto);

        return new ApiResult<>(list);

    }    
    
    @PutMapping(path = "coaching/service/step")
    @Operation(summary = "건강코칭 걸음 업데이트")
    public ApiResult<Boolean> putCareTracStep(@AuthenticationPrincipal JwtAuthentication authentication,
                                                   @RequestBody StepRequest dto) {

    	long accountSeq = 0;
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}
    	dto.setAccountSeq(accountSeq);
        
        careTrackMapper.saveCareTrackStepInfo(dto);
        
        return new ApiResult<>(true);

    }    
    
    @PostMapping(path = "coaching/service/getExerciseUserClassInfo")
    @Operation(summary = "건강코칭 운동평가정보 ")
    public ApiResult<ExerciseUserClassInfo> getCoachinExerciseUserClassInfo(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody ExerciseUserClassInfo dto) {
    	
    	int accountSeq = 0;
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}

    	ExerciseUserClassInfo exerciseUserClassInfo = coachingMapper.getCoachinExerciseUserClassInfo(accountSeq);

        return new ApiResult<>(exerciseUserClassInfo);

    }     


    @PutMapping(path = "coaching/service/saveExerciseUserClass")
    @Operation(summary = "운동평가 정보 저장")
    public ApiResult<Boolean> putExerciseUserClass(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody ExerciseUserClassInfo dto) {
        int existCnt = 0;
        int processCnt = 0;
        Boolean chk = true;
        
    	int accountSeq = 0;
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}
        		
    	ExerciseUserClassInfo exerciseUserClassInfo = coachingMapper.getCoachinExerciseUserClassInfo(accountSeq);
        
        if ( exerciseUserClassInfo != null) {
        	processCnt = coachingMapper.updateExerciseUserClass(accountSeq
        			                                          , dto.getCancerTypeCd()
                                                              , dto.getExerciseProgramCd()
                                                              , dto.getAerobic()      
                                                              , dto.getTherapyCd()
                                                               );
        } else {
        	processCnt = coachingMapper.insertExerciseUserClass(accountSeq
        		                                      	      , dto.getCancerTypeCd()
        			                                          , dto.getExerciseProgramCd()
                                                              , dto.getAerobic()
                                                              , dto.getTherapyCd()
                                                              );
        }
        
        if (processCnt > 0 ) chk = true;
        else chk = false;
        
        return new ApiResult<>(chk);

    }
    
    @PostMapping(path = "coaching/service/getExerciseContentList")
    @Operation(summary = "운동 컨텐츠 정보 ")
    public ApiResult<List<ExerciseContentInfo>> getCoachingExerciseContentList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody ExerciseContentInfo dto) {
    	
    	int accountSeq = 0;
    	try {
    	    accountSeq = coachingMapper.getAccountSeq(dto.getLoginId());
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}

    	List<ExerciseContentInfo> list  = coachingMapper.getCoachingExerciseContentList(dto);

        return new ApiResult<>(list);

    }       
 
    
    @PutMapping(path = "coaching/service/saveExerciseSurveyResult")
    @Operation(summary = "운동 설문 결과 저장")
    public ApiResult<Boolean> saveExerciseSurveyResult(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody ExerciseSurveyResult dto) {
        
    	long accountSeq = 0;
    	try {
    	    accountSeq = Long.valueOf(coachingMapper.getAccountSeq(dto.getLoginId()));
    	} catch (Exception e) {
    		throw new AccountNotFoundException();
    	}
        
    	exerciseSurveyResultRepository.save(CoachingExerciseSurveyResultHst.builder()
    			.accountSeq(accountSeq)
    			.surveyResult(dto.getSurveyResult())
    			.cancerTypeCd(dto.getCancerTypeCd())
    			.difficultyCd(dto.getDifficultyCd())
    			.aerobic(dto.getAerobic())
    			.therapyCd(dto.getTherapyCd())
    			.build());
    	
    	return new ApiResult<>(true);

    }
    
    @PutMapping(path = "coaching/service/saveSchedule")
    @Operation(summary = "건강코칭 일정 등록")
    public ApiResult<Boolean> putSaveScheduleList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody List<ScheduleRequest> dtoList) {
    	List<Long> dayList = new ArrayList<>();
        for (ScheduleRequest dto : dtoList) {
        	Long acSeq = Long.valueOf(coachingMapper.getAccountSeq(dto.getLoginId()));
        	ScheduleType scheduleType = null;
        	
        	if ("A".equals(dto.getCategoryType())) {       		
        		 scheduleType = ScheduleType.SLEEP;
        	} else if ("B".equals(dto.getCategoryType())) {
        		 scheduleType = ScheduleType.EATING;
        	} else if ("C".equals(dto.getCategoryType())) {
        		 scheduleType = ScheduleType.ACTIVITY;
        	} else if ("D".equals(dto.getCategoryType())) {
        		 scheduleType = ScheduleType.MENTALITY;
        	} else if ("E".equals(dto.getCategoryType())) {
        		 scheduleType = ScheduleType.EXERCISE;
        	}
        	
        	// System.out.println("scheduleType => " + scheduleType);
        	// System.out.println("scheduleType.getValue() => " + scheduleType.getValue());
        	System.out.println("dto.getStartDate() => " + dto.getStartDate());
            
			AccountSchedule schedule = scheduleRepository.save(AccountSchedule.builder()
                    .accountSeq(acSeq)
                    //.diseaseSeq(dto.getDiseaseSeq())
                    .scheduleName(dto.getScheduleName())
                    .scheduleType(scheduleType)
                    .startDate(dto.getStartDate())
                    .endDate(dto.getStartDate())
                    .time(dto.getTime())
                    .days(dayList)
                    .repeat(dto.isRepeat())
                    .alarm(true)
                    .memo(dto.getMemo())
                    .enabled(true)
                    .build());

            DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

            LocalDate sDate = LocalDate.parse(dto.getStartDate(), fmt);
            //LocalDate eDate = LocalDate.parse(dto.getEndDate(), fmt);

            long days = 0; //DAYS.between(sDate, eDate);

            List<AccountBatchSchedule> list = new ArrayList<>();

            if (dto.isRepeat()) {
                for (int i = 0; i <= days; i++) {

                    LocalDate day = sDate.plusDays(i);

                    int dayValue = day.getDayOfWeek().getValue();
                    if (dto.getDays().contains((long) dayValue)) {
                        list.add(AccountBatchSchedule.builder()
                                .accountSeq(acSeq)
                                .scheduleSeq(schedule.getSeq())
                                .startDate(day.toString())
                                .endDate(day.toString())
                                .time(dto.getTime())
                                .done(false)
                                .enabled(true)
                                .build());
                    }
                }
            } else {
            	System.out.println("list.add dto.getStartDate() => " + dto.getStartDate());
                list.add(AccountBatchSchedule.builder()
                        .accountSeq(acSeq)
                        .scheduleSeq(schedule.getSeq())
                        .startDate(dto.getStartDate())
                        .endDate(dto.getStartDate())
                        .time(dto.getTime())
                        .done(false)
                        .enabled(true)
                        .build());

            }


            batchScheduleRepository.saveAll(list);        	
        }
        
        return new ApiResult<>(true);

    }        
    
    
    @PutMapping(path = "coaching/service/deleteSchedule")
    @Operation(summary = "건강코칭 일정 삭제")
    public ApiResult<Boolean> putDeleteSchedule(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody ScheduleRequest dto) {
    	int processCnt = 0;
    	String scheduleType = "";
    	
    	Long acSeq = Long.valueOf(coachingMapper.getAccountSeq(dto.getLoginId()));
    	
    	if ("A".equals(dto.getCategoryType())) {
    		scheduleType = "SLEEP";
    	} else if ("B".equals(dto.getCategoryType())) {
    		scheduleType = "EATING";
    	} else if ("C".equals(dto.getCategoryType())) {
    		scheduleType = "ACTIVITY";
    	} else if ("D".equals(dto.getCategoryType())) {
    		scheduleType = "MENTALITY";
    	} else if ("E".equals(dto.getCategoryType())) {
    		scheduleType = "EXERCISE";
    	}
    	
    	processCnt = coachingMapper.updateAccountBatchSchedule(acSeq, scheduleType);
    	processCnt = coachingMapper.updateAccountSchedule(acSeq, scheduleType);
    	
        return new ApiResult<>(true);

    }        

}

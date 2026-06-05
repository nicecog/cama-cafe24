package com.cama.back.mapper;


import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.cama.back.domain.contents.CmContentsVideo;
import com.cama.back.domain.schedule.ScheduleType;
import com.cama.back.dto.coaching.*;
import java.util.List;

@Mapper
@Repository
public interface CoachingMapper {
	
   List<CodeInfo> getCodeInfoList(String code, String cd);
   
   int getAccountSeq(String loginId);
   
   List<QuestionInfo> getQuestionInfoList(int accountSeq
		                                , String categoryCd 
		                                , String stepDayCd
		                                , String progressTypeCd
		                                , String answerTypeCd );
   
   List<QuestionDetailInfo> getQuestionDetailInfoList(int accountSeq
		                                            , String categoryCd
		                                            , String stepDayCd
		                                            , String progressTypeCd
		                                            , int detailSeq );
   
   List<UserAnswerInfo> getUserAnswerInfoList(int accountSeq
		                                    , String categoryCd
		                                    , String stepDayCd
		                                    , String progressTypeCd
		                                    , int answerChoiceSeq );
   
   int getAnswerCnt(int accountSeq
                  , String categoryCd
                  , String stepDayCd
                  , String progressTypeCd
                  , int answerChoiceSeq );
   
   int deleteAnswer(int accountSeq
                  , String categoryCd
                  , String stepDayCd       
                   );
   
   int insertAnswer(int accountSeq
                  , String categoryCd
                  , String stepDayCd
                  , String progressTypeCd
                  , int answerChoiceSeq
                  , String answerChoice
                  , String refVal1
                  , String refVal2
                  , String refVal3
                  , String refVal4
                  , String refVal5                  
                  );
  
   int deleteAddAnswer(int accountSeq
                     , String categoryCd
                     , String stepDayCd       
                      );
   
   int insertAddAnswer(int accountSeq
                     , String categoryCd
                     , String stepDayCd
                     , String progressTypeCd
                     , int answerChoiceSeq
                     , String answerChoice
                     , String refVal1
                     , String refVal2
                     , String refVal3
                     , String refVal4
                     , String refVal5    );
   
   int updateAnswer(int accountSeq
                  , String categoryCd
                  , String stepDayCd
                  , String progressTypeCd
                  , int answerChoiceSeq
                  , String answerChoice
                  , String refVal1
                  , String refVal2
                  , String refVal3
                  , String refVal4
                  , String refVal5    );
   
   List<UserAnswerInfo> getCoachingProgressList(int accountSeq);
   
   //운동평가 정보 
   ExerciseUserClassInfo getCoachinExerciseUserClassInfo(int accountSeq);
      
   int insertExerciseUserClass(int accountSeq
		   , String cancerTypeCd
           , String exerciseProgramCd
           , String aerobic
           , String therapyCd);

   int updateExerciseUserClass(int accountSeq
		   , String cancerTypeCd
           , String exerciseProgramCd
           , String aerobic
           , String therapyCd);
   
   //운동 컨텐츠 
   List<ExerciseContentInfo> getCoachingExerciseContentList(ExerciseContentInfo dto);
   
   int getSurveySeq(int accountSeq);

   int deleteExerciseProgressResult(
		     int accountSeq
           , int surveySeq
           , int answerChoiceSeq
            );

   int insertExerciseProgressResult(
		     int accountSeq
           , int surveySeq
           , int answerChoiceSeq
           );   
   
   //건강코칭 일정 삭제
   int updateAccountBatchSchedule(Long accountSeq, String scheduleType);
   
   //건강코칭 일정 삭제
   int updateAccountSchedule(Long accountSeq, String scheduleType);
}

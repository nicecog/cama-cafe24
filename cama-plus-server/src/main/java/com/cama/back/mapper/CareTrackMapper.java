package com.cama.back.mapper;

import com.cama.back.dto.track.TrackDataRsp;
import com.cama.back.dto.track.TrackServiceRsp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.cama.back.dto.coaching.ExerciseSurveyResult;
import com.cama.back.dto.track.StepRequest;
import com.cama.back.dto.track.TrackReqHst;
import java.util.Optional;
import java.util.List;

@Mapper
@Repository
public interface CareTrackMapper {

    TrackDataRsp getCareTrackData(@Param("acSeq") Long acSeq, @Param("hSeq") Long hSeq,
                                  @Param("dSeq") Long dSeq, @Param("day") Long day);

    int getCareTrackSize(@Param("acSeq") Long acSeq, @Param("trackSeq") Long trackSeq);

    int getCareTrackDoneCount(@Param("acSeq") Long acSeq, @Param("trackSeq") Long trackSeq);

    int getCareTrackContentsDoneCount(@Param("acSeq") Long acSeq, @Param("trackSeq") Long trackSeq, @Param("cSeq") Long cSeq);

    Optional<TrackServiceRsp> getApplyCareTrackInfo(@Param("acSeq") Long acSeq, @Param("hSeq") Long hSeq);

    List<StepRequest> getCareTrackStepList(StepRequest stepRequest);
    
    List<TrackReqHst> getTrackReqHstList(TrackReqHst trackReqHst);
    
    void saveCareTrackStepInfo(StepRequest stepRequest);
    
    List<ExerciseSurveyResult> getExerciseSurveyResultList(ExerciseSurveyResult exerciseSurveyResult);
}

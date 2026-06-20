package com.cama.tablet.mapper;

import com.cama.tablet.dto.CoachingCategoryDto;
import com.cama.tablet.dto.InquiryDto;
import com.cama.tablet.dto.PatientSummaryDto;
import com.cama.tablet.dto.StepDailyDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface TabletDashboardMapper {

    PatientSummaryDto findPatientBySeq(@Param("accountSeq") Long accountSeq);

    PatientSummaryDto findPatientByLoginId(@Param("loginId") String loginId);

    List<StepDailyDto> findRecentSteps(@Param("accountSeq") Long accountSeq, @Param("limit") int limit);

    Long findTodaySteps(@Param("accountSeq") Long accountSeq);

    Long findAvgSteps7d(@Param("accountSeq") Long accountSeq);

    List<CoachingCategoryDto> findCoachingProgress(@Param("accountSeq") Long accountSeq);

    List<InquiryDto> findTreatmentInquiries(@Param("accountSeq") Long accountSeq, @Param("limit") int limit);
}

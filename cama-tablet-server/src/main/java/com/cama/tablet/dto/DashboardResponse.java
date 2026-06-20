package com.cama.tablet.dto;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class DashboardResponse {
    private PatientSummaryDto patient;
    private List<StepDailyDto> steps;
    private Long stepsToday;
    private Long stepsAvg7d;
    private List<CoachingCategoryDto> coaching;
    private List<InquiryDto> inquiries;
    private HeartRateDto heartRate;
}

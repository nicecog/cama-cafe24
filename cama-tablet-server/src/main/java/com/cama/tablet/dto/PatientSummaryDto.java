package com.cama.tablet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PatientSummaryDto {
    private Long seq;
    private String loginId;
    private String name;
    private String birth;
    private String gender;
    private String diseaseName;
    private String userTypeNm;
}

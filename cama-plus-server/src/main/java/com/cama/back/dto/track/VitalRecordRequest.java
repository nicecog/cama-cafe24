package com.cama.back.dto.track;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VitalRecordRequest {

    private Long accountSeq;

    /** ISO-8601 또는 yyyy-MM-dd HH:mm:ss */
    private String measuredAt;

    /** HEART_RATE, BP_SYSTOLIC, BP_DIASTOLIC, SPO2, BODY_TEMP, RESPIRATORY_RATE */
    private String vitalTypeCd;

    private Double valueNum;

    private String unit;

    /** MANUAL, PHONE, WEARABLE */
    private String sourceCd;

    private String memo;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

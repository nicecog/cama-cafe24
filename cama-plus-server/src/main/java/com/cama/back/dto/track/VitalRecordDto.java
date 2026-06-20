package com.cama.back.dto.track;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
public class VitalRecordDto {

    private Long seq;
    private Long accountSeq;
    private String measuredAt;
    private String vitalTypeCd;
    private Double valueNum;
    private String unit;
    private String sourceCd;
    private String memo;
    private String createdAt;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

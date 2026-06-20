package com.cama.back.dto.track;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
public class VitalRecordQuery {

    private Long accountSeq;

    /** yyyy-MM-dd */
    private String fromDate;

    /** yyyy-MM-dd */
    private String toDate;

    private String vitalTypeCd;

    private Integer limit;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

package com.cama.back.dto.schedule;

import com.cama.back.domain.schedule.ScheduleType;
import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRsp {

    private Long scheduleSeq;

    private Long batchSeq;

    private String scheduleName;

    private String diseaseSeq;

    private ScheduleType scheduleType;

    private String scStartDate;

    private String scEndDate;

    private String startDate;

    private String endDate;

    private String time;

    private String days;

    private String memo;

    private boolean repeat;

    private boolean alarm;

    private boolean done;

    private String createdAt;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

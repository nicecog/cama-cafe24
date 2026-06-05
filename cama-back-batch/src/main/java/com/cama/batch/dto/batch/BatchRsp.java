package com.cama.batch.dto.batch;

import com.cama.batch.dto.schedule.ScheduleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BatchRsp implements Serializable {

    private Long seq;

    private Long scheduleSeq;

    private ScheduleType scheduleType;

    private String startDate;

    private String endDate;

    private String time;

    private Long accountSeq;

    private String token;
    
    private String platform;
    
    private String progress;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

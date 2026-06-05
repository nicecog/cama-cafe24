package com.cama.back.dto.schedule;

import com.cama.back.domain.schedule.ScheduleType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScheduleRequest {

    //private List<Long> diseaseSeq;
	private String loginId;          //사용자LoginId
	
	private Long acSeq;
	
	private String categoryType;     //A:수면,B:식습관,C:신체활동, D:심리, E:운동하기 

    private ScheduleType scheduleType;

    private String startDate;

    private String endDate;

    private String time;

    private String memo;

    private List<Long> days;

    private boolean repeat;

    private boolean alarm;

    private String scheduleName;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

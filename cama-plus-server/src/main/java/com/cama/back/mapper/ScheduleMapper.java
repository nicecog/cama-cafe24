package com.cama.back.mapper;

import com.cama.back.dto.schedule.ScheduleRsp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ScheduleMapper {

    List<ScheduleRsp> getAccountSchedule(@Param("acSeq") Long acSeq, @Param("d") String d);

    List<ScheduleRsp> getAccountScheduleMonthly(@Param("acSeq") Long acSeq, @Param("firstDate") String firstDate, @Param("lastDate") String lastDate);

}

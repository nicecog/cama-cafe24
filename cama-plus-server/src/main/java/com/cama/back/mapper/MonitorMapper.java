package com.cama.back.mapper;

import java.util.List;
import java.util.Optional;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import com.cama.back.dto.SearchParam;
import com.cama.back.dto.monitor.MonitorAcctStatDTO;
import com.cama.back.dto.monitor.MonitorCoachingDTO;
import com.cama.back.dto.monitor.MonitorPatientRsp;
import com.cama.back.dto.monitor.MonitorSearchDTO;
import com.cama.back.dto.monitor.MonitorContentsDTO;

@Mapper
@Repository
public interface MonitorMapper {

    int getMonitorPatientListCount(SearchParam searchParam);

    List<MonitorPatientRsp> getMonitorPatientList(SearchParam searchParam);

    Optional<MonitorPatientRsp> getMonitorPatientDetail(@Param("acSeq") Long acSeq, @Param("dSeq") Long dSeq);

    int getCoachingListCount(MonitorCoachingDTO monitorCoachingDTO);

    List<MonitorCoachingDTO> getCoachingMonitoringList(MonitorCoachingDTO monitorCoachingDTO);

    List<MonitorCoachingDTO> getCoachingDetailList(MonitorCoachingDTO monitorCoachingDTO);
    
    String getAccountInfo(long seq);
    
    int deleteUserAnswerInfo(MonitorCoachingDTO monitorCoachingDTO);
    
    int updateAccountInfo(MonitorPatientRsp monitorPatientRsp);
    
    List<MonitorSearchDTO> getSearchTextList(MonitorSearchDTO monitorSearchDTO);
    
    List<MonitorAcctStatDTO> getAccountStatList(MonitorAcctStatDTO monitorAcctStatDTO);
    
    List<MonitorContentsDTO> getFavoriteStatList(MonitorContentsDTO monitorContentsDTO);

    List<MonitorCoachingDTO> getUserCoachingMonitoringList(MonitorCoachingDTO monitorCoachingDTO);
}


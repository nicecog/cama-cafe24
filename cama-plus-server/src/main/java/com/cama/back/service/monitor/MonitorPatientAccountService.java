package com.cama.back.service.monitor;

import com.cama.back.dto.monitor.MonitorPatientAccountDetailRsp;
import com.cama.back.dto.monitor.MonitorPatientEmailUpdateRequest;
import com.cama.back.dto.monitor.MonitorPatientPasswordUpdateRequest;
import com.cama.back.dto.monitor.MonitorPatientPasswordUpdateResponse;

public interface MonitorPatientAccountService {

    MonitorPatientAccountDetailRsp getAccountDetail(Long doctorSeq, Long acSeq);

    boolean updateEmail(Long doctorSeq, MonitorPatientEmailUpdateRequest request);

    MonitorPatientPasswordUpdateResponse updatePassword(Long doctorSeq, MonitorPatientPasswordUpdateRequest request);
}

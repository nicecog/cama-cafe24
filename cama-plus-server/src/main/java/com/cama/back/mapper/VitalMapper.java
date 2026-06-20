package com.cama.back.mapper;

import com.cama.back.dto.track.VitalRecordDto;
import com.cama.back.dto.track.VitalRecordQuery;
import com.cama.back.dto.track.VitalRecordRequest;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface VitalMapper {

    void saveVitalRecord(VitalRecordRequest request);

    List<VitalRecordDto> getVitalRecordList(VitalRecordQuery query);
}

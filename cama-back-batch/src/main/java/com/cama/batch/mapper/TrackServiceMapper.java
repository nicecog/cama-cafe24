package com.cama.batch.mapper;

import com.cama.batch.dto.track.TrackServiceRsp;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface TrackServiceMapper {

    List<TrackServiceRsp> getTrackActiveServiceList();

}

package com.cama.batch.repo.track;


import com.cama.batch.domain.track.TrackService;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrackServiceRepository extends JpaRepository<TrackService, Long> {

    List<TrackService> findBySeqIn(List<Long> seqList);

}

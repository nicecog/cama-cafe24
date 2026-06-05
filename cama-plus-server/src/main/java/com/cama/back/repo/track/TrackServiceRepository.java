package com.cama.back.repo.track;


import com.cama.back.domain.track.TrackService;
import com.cama.back.domain.track.TrackStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrackServiceRepository extends JpaRepository<TrackService, Long> {

    Optional<TrackService> findByAccountSeqAndHospitalSeqAndStatusAndEnabled(Long acSeq, Long hSeq, TrackStatus status, boolean enabled);

}

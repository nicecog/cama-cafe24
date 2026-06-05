package com.cama.back.repo.contents;


import com.cama.back.domain.contents.CmContentsCheck;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CmContentsCheckRepository extends JpaRepository<CmContentsCheck, Long> {

    Optional<CmContentsCheck> findByAccountSeqAndTrackServiceSeqAndContentsSeqAndEnabled(Long acSeq, Long trackServiceSeq, Long cSeq, boolean enabled);

}

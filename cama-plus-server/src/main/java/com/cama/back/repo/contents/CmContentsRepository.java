package com.cama.back.repo.contents;


import com.cama.back.domain.contents.CmContents;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CmContentsRepository extends JpaRepository<CmContents, Long> {

    Optional<CmContents> findBySeqAndEnabled(Long seq, boolean enabled);

}

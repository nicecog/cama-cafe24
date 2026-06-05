package com.cama.back.repo.wellbeing;


import com.cama.back.domain.contents.CmContents;
import com.cama.back.domain.wellbeing.CmWellbeingResources;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CmWellbeingResourcesRepository extends JpaRepository<CmWellbeingResources, Long> {

    Optional<CmWellbeingResources> findBySeqAndEnabled(Long seq, boolean enabled);

}

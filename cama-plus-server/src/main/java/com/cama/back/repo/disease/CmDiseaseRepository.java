package com.cama.back.repo.disease;


import com.cama.back.domain.disease.CmDisease;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CmDiseaseRepository extends JpaRepository<CmDisease, Long> {

    List<CmDisease> findByEnabledOrderBySeqDesc(boolean enabled);

    Optional<CmDisease> findBySeqAndEnabled(Long seq, boolean enabled);

    Optional<CmDisease> findByNameAndEnabled(String name, boolean enabled);

}

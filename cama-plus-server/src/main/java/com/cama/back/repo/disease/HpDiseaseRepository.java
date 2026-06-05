package com.cama.back.repo.disease;


import com.cama.back.domain.hospital.HpDisease;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HpDiseaseRepository extends JpaRepository<HpDisease, Long> {

    Optional<HpDisease> findBySeqAndEnabled(Long seq, boolean enabled);

    Optional<HpDisease> findByHospitalSeqAndDiseaseSeqAndEnabled(Long hospitalSeq, Long diseaseSeq, boolean enabled);

}

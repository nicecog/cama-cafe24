package com.cama.back.repo.disease;


import com.cama.back.domain.hospital.HpDiseaseTreatment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HpDiseaseTreatmentRepository extends JpaRepository<HpDiseaseTreatment, Long> {

    List<HpDiseaseTreatment> findByHpDiseaseSeqAndEnabledOrderBySort(Long hpDiseaseSeq, boolean enabled);

    Optional<HpDiseaseTreatment> findByHpDiseaseSeqAndNameAndEnabled(Long hpDiseaseSeq, String name, boolean enabled);

}

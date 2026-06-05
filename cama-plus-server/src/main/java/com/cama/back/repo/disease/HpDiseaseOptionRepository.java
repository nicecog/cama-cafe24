package com.cama.back.repo.disease;


import com.cama.back.domain.hospital.HpDiseaseOption;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface HpDiseaseOptionRepository extends JpaRepository<HpDiseaseOption, Long> {

    List<HpDiseaseOption> findByHpDiseaseSeqAndEnabledOrderBySort(Long hpDiseaseSeq, boolean enabled);

    Optional<HpDiseaseOption> findByHpDiseaseSeqAndGroupNameAndOptionNameAndEnabled(Long hpDiseaseSeq,
                                                                                    String groupName, String optionName, boolean enabled);

}

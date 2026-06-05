package com.cama.back.repo.disease;


import com.cama.back.domain.disease.CmDiseaseDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CmDiseaseDetailRepository extends JpaRepository<CmDiseaseDetail, Long> {

    List<CmDiseaseDetail> findByDiseaseSeqAndHospitalSeqAndEnabled(Long diseaseSeq, Long hospitalSeq, boolean enabled);

    List<CmDiseaseDetail> findByHospitalSeqAndEnabledOrderBySeqDesc(Long hospitalSeq, boolean enabled);

}

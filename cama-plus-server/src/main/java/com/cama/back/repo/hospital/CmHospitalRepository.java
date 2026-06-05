package com.cama.back.repo.hospital;


import com.cama.back.domain.hospital.CmHospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CmHospitalRepository extends JpaRepository<CmHospital, Long> {

    Optional<CmHospital> findBySeqAndEnabled(Long seq, boolean enabled);

}

package com.cama.back.repo.doctor;


import com.cama.back.domain.doctor.CmDoctor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CmDoctorRepository extends JpaRepository<CmDoctor, Long> {

    Optional<CmDoctor> findByLoginId(String loginId);

    List<CmDoctor> findByHospitalSeqAndEnabled(Long hSeq, boolean enabled);

    Optional<CmDoctor> findByLoginIdAndEnabled(String loginId, boolean enabled);

    Optional<CmDoctor> findBySeqAndEnabled(Long seq, boolean enabled);

}

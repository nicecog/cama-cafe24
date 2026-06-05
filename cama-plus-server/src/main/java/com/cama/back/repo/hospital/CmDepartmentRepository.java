package com.cama.back.repo.hospital;


import com.cama.back.domain.hospital.CmDepartment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CmDepartmentRepository extends JpaRepository<CmDepartment, Long> {

    Optional<CmDepartment> findBySeqAndEnabled(Long seq, boolean enabled);

    Optional<CmDepartment> findByNameAndEnabled(String name, boolean enabled);

    List<CmDepartment> findByEnabledOrderBySeqDesc(boolean enabled);

}

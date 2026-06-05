package com.cama.back.repo;


import com.cama.back.domain.CareTimeType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CareTimeTypeRepository extends JpaRepository<CareTimeType, Long> {

    List<CareTimeType> findBySeqInAndEnabledOrderBySeqDesc(List<Long> list, boolean enabled);

    List<CareTimeType> findByEnabledOrderBySeq(boolean enabled);

}

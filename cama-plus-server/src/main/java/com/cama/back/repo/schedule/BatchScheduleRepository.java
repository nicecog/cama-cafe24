package com.cama.back.repo.schedule;


import com.cama.back.domain.schedule.AccountBatchSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BatchScheduleRepository extends JpaRepository<AccountBatchSchedule, Long> {

    Optional<AccountBatchSchedule> findBySeqAndAccountSeqAndEnabled(Long scSeq, Long acSeq, boolean enabled);

    List<AccountBatchSchedule> findByScheduleSeqAndEnabled(Long scSeq, boolean enabled);

}

package com.cama.back.repo.schedule;


import com.cama.back.domain.schedule.AccountSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ScheduleRepository extends JpaRepository<AccountSchedule, Long> {

    Optional<AccountSchedule> findByAccountSeqAndSeqAndEnabled(Long acSeq, Long seq, boolean enabled);

}

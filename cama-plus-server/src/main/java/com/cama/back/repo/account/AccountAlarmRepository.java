package com.cama.back.repo.account;


import com.cama.back.domain.account.AccountAlarm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountAlarmRepository extends JpaRepository<AccountAlarm, Long> {

    Optional<AccountAlarm> findByAccountSeqAndEnabled(Long accountSeq, boolean enabled);

    List<AccountAlarm> findByEnabled(boolean enabled);

}

package com.cama.back.repo.account;


import com.cama.back.domain.account.AccountRecentNotification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountNotificationRepository extends JpaRepository<AccountRecentNotification, Long> {

    List<AccountRecentNotification> findByAccountSeqAndEnabledOrderBySeqDesc(Long acSeq, boolean enabled);

}

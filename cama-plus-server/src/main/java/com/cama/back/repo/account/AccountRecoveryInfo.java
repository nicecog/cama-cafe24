package com.cama.back.repo.account;

import com.cama.back.domain.account.SignType;

public interface AccountRecoveryInfo {
    Long getSeq();

    String getEmail();

    SignType getSignType();

    String getName();
}

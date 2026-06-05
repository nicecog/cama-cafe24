package com.cama.back.repo.account;

import com.cama.back.domain.account.SignType;

public interface AccountAuthInfo {
    Long getSeq();

    String getLoginId();

    String getNickName();

    String getName();

    SignType getSignType();
}

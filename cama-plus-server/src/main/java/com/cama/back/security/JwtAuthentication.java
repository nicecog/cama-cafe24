package com.cama.back.security;


import com.cama.back.domain.account.Account;
import com.cama.back.domain.api.Id;

import static com.google.common.base.Preconditions.checkNotNull;

public class JwtAuthentication {

    public final Id<Account, Long> id;

    public final String loginId;

    public final String nickName;

    JwtAuthentication(Long id, String loginId, String nickName) {
        checkNotNull(id, "id must be provided.");
        checkNotNull(loginId, "loginId must be provided.");
        //checkNotNull(nickName, "nickName must be provided.");

        this.id = Id.of(Account.class, id);
        this.loginId = loginId;
        this.nickName = nickName;
    }

}

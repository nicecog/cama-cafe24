package com.cama.back.security;

import com.cama.back.domain.account.Account;
import lombok.Getter;

import static com.google.common.base.Preconditions.checkNotNull;

@Getter
public class AuthenticationResult {

    private final String apiToken;
    private final Account account;

    AuthenticationResult(String apiToken, Account account) {
        checkNotNull(apiToken, "apiToken must be provided.");
        checkNotNull(account, "account must be provided.");

        this.apiToken = apiToken;
        this.account = account;
    }

}

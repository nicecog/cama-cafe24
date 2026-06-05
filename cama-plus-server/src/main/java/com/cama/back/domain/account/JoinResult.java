package com.cama.back.domain.account;


import lombok.Getter;

import static com.google.common.base.Preconditions.checkNotNull;

@Getter
public class JoinResult {

    private final String apiToken;
    private final Account account;

    public JoinResult(String apiToken, Account account) {
        checkNotNull(apiToken, "apiToken must be provided.");
        checkNotNull(account, "account must be provided.");

        this.apiToken = apiToken;
        this.account = account;
    }

}

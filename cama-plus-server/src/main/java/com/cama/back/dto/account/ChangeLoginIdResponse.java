package com.cama.back.dto.account;

import com.cama.back.domain.account.Account;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ChangeLoginIdResponse {

    private final String apiToken;
    private final Account account;
    private final String message;
}

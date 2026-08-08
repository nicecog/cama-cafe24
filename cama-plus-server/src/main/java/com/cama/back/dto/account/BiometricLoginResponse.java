package com.cama.back.dto.account;

import com.cama.back.domain.account.Account;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BiometricLoginResponse {
    private String apiToken;
    private Account account;
}

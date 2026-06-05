package com.cama.back.security;

import com.cama.back.domain.admin.CmAdmin;
import lombok.Getter;

import static com.google.common.base.Preconditions.checkNotNull;

@Getter
public class AuthenticationAdminResult {

    private final String apiToken;
    private final CmAdmin admin;

    AuthenticationAdminResult(String apiToken, CmAdmin admin) {
        checkNotNull(apiToken, "apiToken must be provided.");
        checkNotNull(admin, "admin must be provided.");

        this.apiToken = apiToken;
        this.admin = admin;
    }

}

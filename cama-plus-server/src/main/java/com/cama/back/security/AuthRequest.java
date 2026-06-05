package com.cama.back.security;

import io.swagger.v3.oas.annotations.media.Schema;

public class AuthRequest {

    @Schema(description = "로그인 아이디", requiredMode = Schema.RequiredMode.REQUIRED)
    private String principal;

    @Schema(description = "로그인 비밀번호", requiredMode = Schema.RequiredMode.REQUIRED)
    private String credentials;

    protected AuthRequest() {
    }

    public AuthRequest(String principal, String credentials) {
        this.principal = principal;
        this.credentials = credentials;
    }

    public String getPrincipal() {
        return principal;
    }

    public String getCredentials() {
        return credentials;
    }

}

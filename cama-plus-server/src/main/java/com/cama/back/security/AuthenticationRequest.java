package com.cama.back.security;

import com.cama.back.domain.firebase.Firebase;
import io.swagger.v3.oas.annotations.media.Schema;

public class AuthenticationRequest {

    @Schema(description = "로그인 아이디", requiredMode = Schema.RequiredMode.REQUIRED)
    private String principal;

    @Schema(description = "로그인 비밀번호", requiredMode = Schema.RequiredMode.REQUIRED)
    private String credentials;

    @Schema(description = "파베 정보", requiredMode = Schema.RequiredMode.REQUIRED)
    private Firebase firebase;

    protected AuthenticationRequest() {
    }

    public AuthenticationRequest(String principal, String credentials, Firebase firebase) {
        this.principal = principal;
        this.credentials = credentials;
        this.firebase = firebase;
    }

    public String getPrincipal() {
        return principal;
    }

    public String getCredentials() {
        return credentials;
    }

    public Firebase getFirebase() {
        return firebase;
    }
}

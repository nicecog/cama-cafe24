package com.cama.back.security;

import com.cama.back.domain.firebase.Firebase;
import io.swagger.v3.oas.annotations.media.Schema;

public class AuthenticationPassRequest {

    @Schema(description = "ImpUid", requiredMode = Schema.RequiredMode.REQUIRED)
    private String impUid;

    @Schema(description = "파베 정보", requiredMode = Schema.RequiredMode.REQUIRED)
    private Firebase firebase;

    protected AuthenticationPassRequest() {
    }

    public AuthenticationPassRequest(String impUid, Firebase firebase) {
        this.impUid = impUid;
        this.firebase = firebase;
    }

    public String getImpUid() {
        return impUid;
    }

    public Firebase getFirebase() {
        return firebase;
    }
}

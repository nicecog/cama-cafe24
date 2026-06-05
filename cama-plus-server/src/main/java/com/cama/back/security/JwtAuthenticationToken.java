package com.cama.back.security;

import com.cama.back.domain.account.LoginType;
import com.cama.back.domain.firebase.Firebase;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

public class JwtAuthenticationToken extends AbstractAuthenticationToken {

    private Object principal;

    private String credentials;

    private String impUid;

    private Firebase firebase;

    private boolean sns;

    private LoginType loginType;

    public JwtAuthenticationToken(String principal, String credentials) {
        super(null);
        super.setAuthenticated(false);

        this.principal = principal;
        this.credentials = credentials;
    }

    public JwtAuthenticationToken(String impUid, Firebase firebase, LoginType loginType) {
        super(null);
        super.setAuthenticated(false);

        this.impUid = impUid;
        this.firebase = firebase;
        this.loginType = loginType;
    }

    public JwtAuthenticationToken(String principal, String credentials, Firebase firebase, LoginType loginType) {
        super(null);
        super.setAuthenticated(false);

        this.principal = principal;
        this.credentials = credentials;
        this.firebase = firebase;
        this.loginType = loginType;
    }

    public JwtAuthenticationToken(String principal, String credentials, boolean sns) {
        super(null);
        super.setAuthenticated(false);

        this.principal = principal;
        this.credentials = credentials;
        this.sns = sns;
    }

    public JwtAuthenticationToken(String principal, String credentials, LoginType loginType) {
        super(null);
        super.setAuthenticated(false);

        this.principal = principal;
        this.credentials = credentials;
        this.loginType = loginType;
    }

    JwtAuthenticationToken(Object principal, String credentials, Collection<? extends GrantedAuthority> authorities) {
        super(authorities);
        super.setAuthenticated(true);

        this.principal = principal;
        this.credentials = credentials;
    }

    AuthenticationRequest authenticationRequest() {
        return new AuthenticationRequest(String.valueOf(principal), credentials, firebase);
    }

    AuthenticationPassRequest authenticationPassRequest() {
        return new AuthenticationPassRequest(impUid, firebase);
    }

    @Override
    public Object getPrincipal() {
        return principal;
    }

    @Override
    public String getCredentials() {
        return credentials;
    }

    public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
        if (isAuthenticated)
            throw new IllegalArgumentException("Cannot set this token to trusted - use constructor which takes a GrantedAuthority list instead");

        super.setAuthenticated(false);
    }

    @Override
    public void eraseCredentials() {
        super.eraseCredentials();
        credentials = null;
    }

    public boolean isSns() {
        return sns;
    }

    public LoginType getLoginType() {
        return loginType;
    }

    public String getImpUid() {
        return impUid;
    }
}
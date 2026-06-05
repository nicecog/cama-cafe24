package com.cama.back.security;

import com.auth0.jwt.JWTCreator;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.Claim;
import com.auth0.jwt.interfaces.DecodedJWT;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.Date;

@Getter
public final class JWT {

    private final String issuer;

    private final String clientSecret;

    private final int expirySeconds;

    private final Algorithm algorithm;

    private final JWTVerifier jwtVerifier;

    public JWT(String issuer, String clientSecret, int expirySeconds) {

        this.issuer = issuer;
        this.clientSecret = clientSecret;
        this.expirySeconds = expirySeconds;
        this.algorithm = Algorithm.HMAC512(clientSecret);
        this.jwtVerifier = com.auth0.jwt.JWT.require(algorithm)
                .withIssuer(issuer)
                .build();
    }

    public String newToken(Claims claims) {

        Date now = new Date();
        JWTCreator.Builder builder = com.auth0.jwt.JWT.create();
        builder.withIssuer(issuer);
        builder.withIssuedAt(now);

        if (expirySeconds > 0) {
            builder.withExpiresAt(new Date(now.getTime() + expirySeconds * 1_000L));
        }
        builder.withClaim("userKey", claims.userKey);
        builder.withClaim("nickName", claims.nickName != null ? claims.nickName : "");
        builder.withClaim("loginId", claims.loginId != null ? claims.loginId : "");
        builder.withArrayClaim("roles", claims.roles != null ? claims.roles : new String[0]);

        // 암호화
        return builder.sign(algorithm);

    }

    public String refreshToken(String token) throws JWTVerificationException {
        Claims claims = verify(token);
        claims.eraseIat();
        claims.eraseExp();
        return newToken(claims);
    }

    public Claims verify(String token) throws JWTVerificationException {
        // 복호화
        return new Claims(jwtVerifier.verify(token));
    }

    @NoArgsConstructor
    @AllArgsConstructor
    static public class Claims {

        Long userKey;
        String nickName;
        String loginId;
        String[] roles;
        Date iat;
        Date exp;

        Claims(DecodedJWT decodedJWT) {
            Claim userKey = decodedJWT.getClaim("userKey");
            if (!userKey.isNull()) {
                this.userKey = userKey.asLong();
            }

            Claim loginId = decodedJWT.getClaim("loginId");
            if (!loginId.isNull()) {
                this.loginId = loginId.asString();
            }

            Claim nickName = decodedJWT.getClaim("nickName");
            if (!nickName.isNull()) {
                this.nickName = nickName.asString();
            }

            Claim roles = decodedJWT.getClaim("roles");
            if (!roles.isNull()) {
                this.roles = roles.asArray(String.class);
            }
            this.iat = decodedJWT.getIssuedAt();
            this.exp = decodedJWT.getExpiresAt();
        }

        public static Claims of(long userKey, String loginId, String nickName, String[] roles) {
            Claims claims = new Claims();
            claims.userKey = userKey;
            claims.loginId = loginId;
            claims.nickName = nickName;
            claims.roles = roles;
            return claims;
        }

        long iat() {
            return iat != null ? iat.getTime() : -1;
        }

        long exp() {
            return exp != null ? exp.getTime() : -1;
        }

        void eraseIat() {
            iat = null;
        }

        void eraseExp() {
            exp = null;
        }

        @Override
        public String toString() {
            return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
        }
    }

}

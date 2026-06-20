package com.cama.back.service.tablet;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.cama.back.config.TabletQrProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.Getter;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Service
@ConditionalOnProperty(prefix = "cama.tablet.qr", name = "secret")
public class TabletQrTokenService {

    private final TabletQrProperties properties;
    private final Algorithm algorithm;
    private final JWTVerifier verifier;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public TabletQrTokenService(TabletQrProperties properties) {
        this.properties = properties;
        if (properties.getSecret() == null || properties.getSecret().isBlank()) {
            throw new IllegalStateException("cama.tablet.qr.secret must be set");
        }
        this.algorithm = Algorithm.HMAC256(properties.getSecret());
        this.verifier = JWT.require(algorithm)
                .withIssuer(properties.getIssuer())
                .build();
    }

    public IssuedToken issue(long accountSeq, String loginId) {
        Instant now = Instant.now();
        Instant expires = now.plusSeconds(properties.getTtlSeconds());
        String token = JWT.create()
                .withIssuer(properties.getIssuer())
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(expires))
                .withClaim("accountSeq", accountSeq)
                .withClaim("loginId", loginId)
                .sign(algorithm);

        ObjectNode qr = objectMapper.createObjectNode();
        qr.put("v", 2);
        qr.put("t", token);

        IssuedToken issued = new IssuedToken();
        issued.setToken(token);
        issued.setQrPayload(qr.toString());
        issued.setExpiresAtEpochMs(expires.toEpochMilli());
        issued.setTtlSeconds(properties.getTtlSeconds());
        return issued;
    }

    /** 발급·검증 키 일치 확인용 (운영 점검) */
    public DecodedJWT verify(String token) {
        return verifier.verify(token);
    }

    @Getter
    public static class IssuedToken {
        private String token;
        private String qrPayload;
        private long expiresAtEpochMs;
        private int ttlSeconds;

        public void setToken(String token) {
            this.token = token;
        }

        public void setQrPayload(String qrPayload) {
            this.qrPayload = qrPayload;
        }

        public void setExpiresAtEpochMs(long expiresAtEpochMs) {
            this.expiresAtEpochMs = expiresAtEpochMs;
        }

        public void setTtlSeconds(int ttlSeconds) {
            this.ttlSeconds = ttlSeconds;
        }
    }
}

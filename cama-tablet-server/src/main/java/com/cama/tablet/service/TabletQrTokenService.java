package com.cama.tablet.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.exceptions.TokenExpiredException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.cama.tablet.config.TabletQrProperties;
import com.cama.tablet.dto.QrPayload;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import lombok.Getter;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Date;

@Service
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

    public QrPayload verifyToPayload(String token) {
        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("QR 토큰이 비어 있습니다.");
        }
        try {
            DecodedJWT jwt = verifier.verify(token.trim());
            QrPayload payload = new QrPayload();
            payload.setV(2);
            payload.setAccountSeq(jwt.getClaim("accountSeq").asLong());
            payload.setLoginId(jwt.getClaim("loginId").asString());
            if (payload.getAccountSeq() == null) {
                throw new IllegalArgumentException("QR 토큰에 환자 정보가 없습니다.");
            }
            return payload;
        } catch (TokenExpiredException e) {
            throw new IllegalArgumentException("QR 코드가 만료되었습니다. 환자 앱에서 새 QR을 발급해 주세요.");
        } catch (JWTVerificationException e) {
            throw new IllegalArgumentException("유효하지 않은 QR 코드입니다.");
        }
    }

    public boolean isRequireSigned() {
        return properties.isRequireSigned();
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

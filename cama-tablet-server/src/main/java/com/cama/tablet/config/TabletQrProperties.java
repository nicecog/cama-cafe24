package com.cama.tablet.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "cama.tablet.qr")
public class TabletQrProperties {

    /** HMAC 서명 키 — cama-plus-server 와 동일 값 필수 */
    private String secret = "dev-tablet-qr-secret-change-me";

    private String issuer = "cama-tablet-qr";

    /** QR 유효 시간(초). 기본 5분 */
    private int ttlSeconds = 300;

    /** true 이면 v1(평문) QR 거부 */
    private boolean requireSigned = false;

    /** 로컬 개발용 무인증 발급 허용 */
    private boolean allowDevIssue = false;

    private String devIssueKey = "";
}

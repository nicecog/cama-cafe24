package com.cama.back.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Getter
@Setter
@ConfigurationProperties(prefix = "cama.tablet.qr")
public class TabletQrProperties {

    private String secret = "";

    private String issuer = "cama-tablet-qr";

    private int ttlSeconds = 300;
}

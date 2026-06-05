package com.cama.doctorweb.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

/**
 * 애플리케이션 전역 설정 (외부 API, Firebase 등)
 */
@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "cama")
public class CamaProperties {

    private final Billive billive = new Billive();
    private final Firebase firebase = new Firebase();

    @Getter
    @Setter
    public static class Billive {
        /** 기존 React mainApiClient의 baseURL */
        private String baseUrl = "https://api.billive.me";
    }

    @Getter
    @Setter
    public static class Firebase {
        private boolean enabled = false;
        private String credentialsPath = "firebase/cama-service-account.json";
    }
}

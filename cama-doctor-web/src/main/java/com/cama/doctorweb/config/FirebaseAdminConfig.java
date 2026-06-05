package com.cama.doctorweb.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;

/**
 * Firebase Admin 초기화 (firebase.enabled=true 일 때만).
 * credentials-path: 클래스패스 상대 경로 또는 서버 절대 경로(예: /secrets/firebase-sa.json).
 */
@Slf4j
@Configuration
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "cama.firebase", name = "enabled", havingValue = "true")
public class FirebaseAdminConfig {

    private final CamaProperties camaProperties;

    @Bean
    public FirebaseApp firebaseApp() throws IOException {
        if (!FirebaseApp.getApps().isEmpty()) {
            return FirebaseApp.getInstance();
        }
        String path = camaProperties.getFirebase().getCredentialsPath();
        File file = new File(path);
        try (InputStream in = file.isAbsolute()
                ? new FileInputStream(file)
                : new ClassPathResource(path).getInputStream()) {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(in))
                    .build();
            FirebaseApp app = FirebaseApp.initializeApp(options);
            log.info("Firebase Admin 초기화 완료 (경로: {})", path);
            return app;
        }
    }
}

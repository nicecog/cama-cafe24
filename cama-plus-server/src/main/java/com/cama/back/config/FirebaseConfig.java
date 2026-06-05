package com.cama.back.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import jakarta.annotation.PostConstruct;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

@Configuration
public class FirebaseConfig {

    private static final Logger logger = LoggerFactory.getLogger(FirebaseConfig.class);
    private static final String DEFAULT_CREDENTIALS_PATH =
            "firebase/cama-plus-firebase-adminsdk-cl1lc-d77517b08c.json";

    @Value("${firebase.credentials-path:}")
    private String credentialsPath;

    @PostConstruct
    public void initialize() {
        try {
            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(openCredentialsStream()))
                    .build();
            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                logger.info("Firebase application has been initialized");
            }
        } catch (Exception e) {
            logger.error("Firebase initialization failed: {}", e.getMessage());
        }
    }

    private InputStream openCredentialsStream() throws IOException {
        String path = credentialsPath != null && !credentialsPath.isBlank()
                ? credentialsPath.trim()
                : DEFAULT_CREDENTIALS_PATH;
        Path filePath = Path.of(path);
        if (Files.isRegularFile(filePath)) {
            logger.info("Loading Firebase credentials from file: {}", filePath.toAbsolutePath());
            return new FileInputStream(filePath.toFile());
        }
        return new ClassPathResource(path).getInputStream();
    }
}

package com.cama.back.service.storage;

import com.cama.back.config.CamaHostingProperties;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@ConditionalOnProperty(name = "cama.hosting.storage-type", havingValue = "local")
public class LocalImageStorageService implements ImageStorageService {

    private static final Logger logger = LoggerFactory.getLogger(LocalImageStorageService.class);

    private final CamaHostingProperties hostingProperties;
    private Path rootPath;

    public LocalImageStorageService(CamaHostingProperties hostingProperties) {
        this.hostingProperties = hostingProperties;
    }

    @PostConstruct
    void init() throws IOException {
        rootPath = Paths.get(hostingProperties.getLocalStoragePath()).toAbsolutePath().normalize();
        Files.createDirectories(rootPath);
        logger.info("Local image storage root: {}", rootPath);
    }

    @Override
    public String upload(String relativeKey, byte[] content, String contentType) {
        validateKey(relativeKey);

        Path target = rootPath.resolve(relativeKey).normalize();
        if (!target.startsWith(rootPath)) {
            throw new IllegalArgumentException("Invalid storage key");
        }

        try {
            Files.createDirectories(target.getParent());
            Files.write(target, content);
        } catch (IOException e) {
            throw new IllegalStateException("Failed to store image: " + relativeKey, e);
        }

        return publicUrl(relativeKey);
    }

    public Path getRootPath() {
        return rootPath;
    }

    private void validateKey(String relativeKey) {
        if (relativeKey == null || relativeKey.isBlank()) {
            throw new IllegalArgumentException("Storage key is required");
        }
        if (relativeKey.contains("..") || relativeKey.startsWith("/") || relativeKey.startsWith("\\")) {
            throw new IllegalArgumentException("Invalid storage key");
        }
    }

    private String publicUrl(String relativeKey) {
        String base = hostingProperties.getImageCdnBaseUrl();
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        return base + "/" + relativeKey;
    }
}

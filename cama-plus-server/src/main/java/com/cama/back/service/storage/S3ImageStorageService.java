package com.cama.back.service.storage;

import com.amazonaws.services.s3.model.ObjectMetadata;
import com.cama.back.config.CamaHostingProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

import com.amazonaws.services.s3.AmazonS3;

import java.io.ByteArrayInputStream;

@Service
@ConditionalOnProperty(name = "cama.hosting.storage-type", havingValue = "s3")
public class S3ImageStorageService implements ImageStorageService {

    private final AmazonS3 amazonS3;
    private final CamaHostingProperties hostingProperties;

    public S3ImageStorageService(AmazonS3 amazonS3, CamaHostingProperties hostingProperties) {
        this.amazonS3 = amazonS3;
        this.hostingProperties = hostingProperties;
    }

    @Override
    public String upload(String relativeKey, byte[] content, String contentType) {
        ObjectMetadata metadata = new ObjectMetadata();
        metadata.setContentLength(content.length);
        if (contentType != null && !contentType.isBlank()) {
            metadata.setContentType(contentType);
        }

        amazonS3.putObject(
                hostingProperties.getS3Bucket(),
                relativeKey,
                new ByteArrayInputStream(content),
                metadata);

        return publicUrl(relativeKey);
    }

    private String publicUrl(String relativeKey) {
        String base = hostingProperties.getImageCdnBaseUrl();
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        return base + "/" + relativeKey;
    }
}

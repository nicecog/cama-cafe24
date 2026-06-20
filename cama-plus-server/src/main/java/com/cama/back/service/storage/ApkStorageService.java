package com.cama.back.service.storage;

import com.cama.back.config.CamaHostingProperties;
import com.cama.back.dto.doctor.ApkReleaseDto;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class ApkStorageService {

    private static final Logger logger = LoggerFactory.getLogger(ApkStorageService.class);
    private static final String INDEX_FILE = "apk-index.json";
    private static final Pattern SAFE_FILE_NAME = Pattern.compile("^[a-zA-Z0-9._-]+\\.apk$");

    private final CamaHostingProperties hostingProperties;
    private final ObjectMapper objectMapper;
    private Path rootPath;

    public ApkStorageService(CamaHostingProperties hostingProperties) {
        this.hostingProperties = hostingProperties;
        this.objectMapper = new ObjectMapper().enable(SerializationFeature.INDENT_OUTPUT);
    }

    @PostConstruct
    void init() throws IOException {
        rootPath = Paths.get(hostingProperties.getApkStoragePath()).toAbsolutePath().normalize();
        Files.createDirectories(rootPath);
        logger.info("APK storage root: {}", rootPath);
    }

    public Path getRootPath() {
        return rootPath;
    }

    public List<ApkReleaseDto> listReleases() throws IOException {
        List<ApkReleaseDto> releases = readIndex();
        releases.sort(Comparator.comparing(ApkReleaseDto::getUploadedAt).reversed());
        return releases;
    }

    public ApkReleaseDto upload(MultipartFile file, String version) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("APK 파일이 필요합니다.");
        }

        String originalName = file.getOriginalFilename();
        if (originalName == null || originalName.isBlank()) {
            throw new IllegalArgumentException("파일 이름을 확인할 수 없습니다.");
        }

        String fileName = Paths.get(originalName).getFileName().toString();
        if (!SAFE_FILE_NAME.matcher(fileName).matches()) {
            throw new IllegalArgumentException("허용되지 않는 파일 이름입니다. (.apk, 영문/숫자/._- 만 허용)");
        }

        String normalizedVersion = normalizeVersion(version, fileName);
        Path target = rootPath.resolve(fileName).normalize();
        if (!target.startsWith(rootPath)) {
            throw new IllegalArgumentException("Invalid file path");
        }

        Files.write(target, file.getBytes());

        ApkReleaseDto release = new ApkReleaseDto(
                fileName,
                normalizedVersion,
                publicUrl(fileName),
                formatInstant(Instant.now()),
                Files.size(target)
        );

        List<ApkReleaseDto> releases = readIndex();
        releases.removeIf(item -> fileName.equals(item.getFileName()));
        releases.add(release);
        writeIndex(releases);

        return release;
    }

    public void delete(String fileName) throws IOException {
        validateFileName(fileName);

        Path target = rootPath.resolve(fileName).normalize();
        if (!target.startsWith(rootPath)) {
            throw new IllegalArgumentException("Invalid file path");
        }

        Files.deleteIfExists(target);

        List<ApkReleaseDto> releases = readIndex();
        releases.removeIf(item -> fileName.equals(item.getFileName()));
        writeIndex(releases);
    }

    private List<ApkReleaseDto> readIndex() throws IOException {
        Path indexPath = rootPath.resolve(INDEX_FILE);
        if (!Files.exists(indexPath)) {
            return new ArrayList<>();
        }
        return objectMapper.readValue(indexPath.toFile(), new TypeReference<List<ApkReleaseDto>>() {});
    }

    private void writeIndex(List<ApkReleaseDto> releases) throws IOException {
        Path indexPath = rootPath.resolve(INDEX_FILE);
        objectMapper.writeValue(indexPath.toFile(), releases);
    }

    private void validateFileName(String fileName) {
        if (fileName == null || fileName.isBlank() || !SAFE_FILE_NAME.matcher(fileName).matches()) {
            throw new IllegalArgumentException("허용되지 않는 파일 이름입니다.");
        }
    }

    private String normalizeVersion(String version, String fileName) {
        if (version != null && !version.isBlank()) {
            return version.trim();
        }
        String lower = fileName.toLowerCase(Locale.ROOT);
        int releaseIdx = lower.indexOf("-release");
        if (releaseIdx > 0) {
            String prefix = fileName.substring(0, releaseIdx);
            int lastDash = prefix.lastIndexOf('-');
            if (lastDash >= 0 && lastDash < prefix.length() - 1) {
                return prefix.substring(lastDash + 1);
            }
        }
        return "unknown";
    }

    private String publicUrl(String fileName) {
        String base = hostingProperties.getApkPublicBaseUrl();
        if (base.endsWith("/")) {
            base = base.substring(0, base.length() - 1);
        }
        return base + "/" + fileName;
    }

    private String formatInstant(Instant instant) {
        return DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm")
                .withZone(ZoneId.of("Asia/Seoul"))
                .format(instant);
    }
}

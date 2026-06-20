package com.cama.back.dto.doctor;

public class ApkReleaseDto {

    private String fileName;
    private String version;
    private String downloadUrl;
    private String uploadedAt;
    private long sizeBytes;

    public ApkReleaseDto() {
    }

    public ApkReleaseDto(String fileName, String version, String downloadUrl, String uploadedAt, long sizeBytes) {
        this.fileName = fileName;
        this.version = version;
        this.downloadUrl = downloadUrl;
        this.uploadedAt = uploadedAt;
        this.sizeBytes = sizeBytes;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }

    public String getDownloadUrl() {
        return downloadUrl;
    }

    public void setDownloadUrl(String downloadUrl) {
        this.downloadUrl = downloadUrl;
    }

    public String getUploadedAt() {
        return uploadedAt;
    }

    public void setUploadedAt(String uploadedAt) {
        this.uploadedAt = uploadedAt;
    }

    public long getSizeBytes() {
        return sizeBytes;
    }

    public void setSizeBytes(long sizeBytes) {
        this.sizeBytes = sizeBytes;
    }
}

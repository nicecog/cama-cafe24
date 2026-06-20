package com.cama.back.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.ArrayList;
import java.util.List;

@ConfigurationProperties(prefix = "cama.hosting")
public class CamaHostingProperties {

    /** local: VPS 디스크, s3: AWS S3 (legacy — Cafe24 운영은 local) */
    private String storageType = "local";

    /** 업로드 이미지 공개 URL prefix */
    private String imageCdnBaseUrl = "https://camaplus.cafe24.com/files";

    /** local 저장 루트 (storage-type=local) */
    private String localStoragePath = "./data/cama-files";

    /** S3 버킷명 (storage-type=s3) */
    private String s3Bucket = "cama-images";

    /** CORS 허용 origin */
    private List<String> corsAllowedOrigins = new ArrayList<>(List.of("*"));

    /** APK 저장 루트 (local) */
    private String apkStoragePath = "./data/apk_down";

    /** APK 공개 다운로드 URL prefix */
    private String apkPublicBaseUrl = "https://camaplus.cafe24.com/apk_down";

    public String getStorageType() {
        return storageType;
    }

    public void setStorageType(String storageType) {
        this.storageType = storageType;
    }

    public String getLocalStoragePath() {
        return localStoragePath;
    }

    public void setLocalStoragePath(String localStoragePath) {
        this.localStoragePath = localStoragePath;
    }

    public String getImageCdnBaseUrl() {
        return imageCdnBaseUrl;
    }

    public void setImageCdnBaseUrl(String imageCdnBaseUrl) {
        this.imageCdnBaseUrl = imageCdnBaseUrl;
    }

    public String getS3Bucket() {
        return s3Bucket;
    }

    public void setS3Bucket(String s3Bucket) {
        this.s3Bucket = s3Bucket;
    }

    public List<String> getCorsAllowedOrigins() {
        return corsAllowedOrigins;
    }

    public void setCorsAllowedOrigins(List<String> corsAllowedOrigins) {
        this.corsAllowedOrigins = corsAllowedOrigins;
    }

    public String getApkStoragePath() {
        return apkStoragePath;
    }

    public void setApkStoragePath(String apkStoragePath) {
        this.apkStoragePath = apkStoragePath;
    }

    public String getApkPublicBaseUrl() {
        return apkPublicBaseUrl;
    }

    public void setApkPublicBaseUrl(String apkPublicBaseUrl) {
        this.apkPublicBaseUrl = apkPublicBaseUrl;
    }
}

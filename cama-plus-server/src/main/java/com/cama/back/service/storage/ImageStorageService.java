package com.cama.back.service.storage;

public interface ImageStorageService {

    /**
     * @param relativeKey 예: upload/2026-05-30/abc.jpg
     * @return 공개 접근 URL
     */
    String upload(String relativeKey, byte[] content, String contentType);
}

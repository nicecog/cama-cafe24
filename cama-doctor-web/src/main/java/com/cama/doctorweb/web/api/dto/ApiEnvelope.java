package com.cama.doctorweb.web.api.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Value;

/**
 * 공통 API 응답 래퍼 (클라이언트 fetch에서 success / error 판별용)
 */
@Value
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiEnvelope<T> {
    boolean success;
    T data;
    ApiError error;

    public static <T> ApiEnvelope<T> ok(T data) {
        return ApiEnvelope.<T>builder().success(true).data(data).build();
    }

    public static ApiEnvelope<Void> fail(String message, int code) {
        return ApiEnvelope.<Void>builder()
                .success(false)
                .error(ApiError.builder().message(message).code(code).build())
                .build();
    }

    @Value
    @Builder
    public static class ApiError {
        String message;
        int code;
    }
}

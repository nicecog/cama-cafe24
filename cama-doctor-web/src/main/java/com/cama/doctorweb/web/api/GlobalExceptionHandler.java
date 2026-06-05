package com.cama.doctorweb.web.api;

import com.cama.doctorweb.web.api.dto.ApiEnvelope;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.cama.doctorweb.web.proxy.BilliveProxyController;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestClientException;

/**
 * 서버 오류 시 공통 응답(JSON). 클라이언트 JS에서 Alert 등으로 처리합니다.
 */
@Slf4j
@RestControllerAdvice(assignableTypes = BilliveProxyController.class)
public class GlobalExceptionHandler {

    @ExceptionHandler(HttpStatusCodeException.class)
    public ResponseEntity<ApiEnvelope<Void>> handleUpstream(HttpStatusCodeException e) {
        log.warn("외부 API 오류: {} {}", e.getStatusCode(), e.getMessage());
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(ApiEnvelope.fail(
                        e.getResponseBodyAsString() != null && !e.getResponseBodyAsString().isBlank()
                                ? e.getResponseBodyAsString()
                                : e.getMessage(),
                        e.getStatusCode().value()
                ));
    }

    @ExceptionHandler(RestClientException.class)
    public ResponseEntity<ApiEnvelope<Void>> handleRest(RestClientException e) {
        log.error("HTTP 클라이언트 오류", e);
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(ApiEnvelope.fail("외부 서비스 연결에 실패했습니다.", 502));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiEnvelope<Void>> handleGeneric(Exception e) {
        log.error("처리되지 않은 오류", e);
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiEnvelope.fail("서버 오류가 발생했습니다.", 500));
    }
}

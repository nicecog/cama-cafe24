package com.cama.batch.domain.api;

import org.springframework.http.HttpStatus;

public class ApiError {

    private int code;
    private int status;

    private String message;

    public ApiError(Throwable throwable, HttpStatus status) {
        this(throwable.getMessage(), status);
    }

    public ApiError(String message, HttpStatus status) {
        this.message = message;
        this.status = status.value();
    }

    public ApiError(Throwable throwable, HttpStatus status, int code) {
        this(throwable.getMessage(), status, code);
    }

    public ApiError(String message, HttpStatus status, int code) {
        this.message = message;
        this.status = status.value();
        this.code = code;
    }

    public int getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }

    public int getCode() {
        return code;
    }
}
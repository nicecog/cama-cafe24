package com.cama.batch.domain.api;

import com.cama.batch.dto.Pagination;
import org.springframework.http.HttpStatus;

public class ApiResult<T> {

    private boolean success;

    private ApiError error;

    private T response;

    private Pagination pagination;

    public ApiResult(T response) {
        this.response = response;
        this.success = true;
    }

    public ApiResult(T response, Pagination pagination) {
        this.response = response;
        this.success = true;
        this.pagination = pagination;
    }

    public ApiResult(String message, HttpStatus status) {
        this.success = false;
        this.response = null;
        this.error = new ApiError(message, status);
    }

    public ApiResult(Throwable throwable, HttpStatus status) {
        this.success = false;
        this.response = null;
        this.error = new ApiError(throwable, status);
    }

    public ApiResult(String message, HttpStatus status, int code) {
        this.success = false;
        this.response = null;
        this.error = new ApiError(message, status, code);
    }

    public boolean isSuccess() {
        return success;
    }

    public ApiError getError() {
        return error;
    }

    public T getResponse() {
        return response;
    }

    public Pagination getPagination() {
        return pagination;
    }

}
package com.cama.tablet.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class ApiResult<T> {

    private boolean success;
    private String message;
    private T response;

    public static <T> ApiResult<T> ok(T data) {
        return new ApiResult<>(true, null, data);
    }

    public static <T> ApiResult<T> fail(String message) {
        return new ApiResult<>(false, message, null);
    }
}

package com.cama.back.exception.nutrition;

/**
 * 앱 catalog 와 서버 마스터가 불일치할 때 발생한다. 클라이언트는 catalog 갱신 후 재시도해야 한다.
 */
public class FoodClassNotFoundException extends RuntimeException {

    private final String classKey;

    public FoodClassNotFoundException(String classKey) {
        this.classKey = classKey;
    }

    public String getClassKey() {
        return classKey;
    }
}

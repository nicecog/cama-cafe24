package com.cama.back.domain.nutrition;

import com.cama.back.domain.api.EnumModel;

import java.util.Arrays;
import java.util.Locale;

public enum MealSource implements EnumModel {

    /** 온디바이스 사진 추론 결과 */
    ONDEVICE("ONDEVICE"),

    /** 사용자 직접 입력 */
    MANUAL("MANUAL");

    private final String value;

    MealSource(String value) {
        this.value = value;
    }

    @Override
    public String getKey() {
        return name();
    }

    @Override
    public String getValue() {
        return value;
    }

    public static MealSource from(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim().toUpperCase(Locale.ROOT);
        return Arrays.stream(values())
                .filter(x -> x.value.equals(normalized))
                .findFirst()
                .orElse(null);
    }
}

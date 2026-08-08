package com.cama.back.domain.nutrition;

import com.cama.back.domain.api.EnumModel;

import java.util.Arrays;
import java.util.Locale;

public enum MealType implements EnumModel {

    BREAKFAST("BREAKFAST"),
    LUNCH("LUNCH"),
    DINNER("DINNER"),
    SNACK("SNACK");

    private final String value;

    MealType(String value) {
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

    public static MealType from(String value) {
        if (value == null) {
            return null;
        }
        String normalized = value.trim().toUpperCase(Locale.ROOT);
        return Arrays.stream(values())
                .filter(x -> x.value.equals(normalized))
                .findFirst()
                .orElse(null);
    }

    public String labelKo() {
        return switch (this) {
            case BREAKFAST -> "아침";
            case LUNCH -> "점심";
            case DINNER -> "저녁";
            case SNACK -> "간식";
        };
    }
}

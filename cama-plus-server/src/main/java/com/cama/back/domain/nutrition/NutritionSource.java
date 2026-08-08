package com.cama.back.domain.nutrition;

import com.cama.back.domain.api.EnumModel;

public enum NutritionSource implements EnumModel {

    /** 식약처 식품영양성분 DB 정본 */
    MFDS("MFDS"),

    /** cm_food_class 폴백 영양값 (식품코드 미매핑) */
    CLASS_FALLBACK("CLASS_FALLBACK"),

    /** 영양값 확보 실패. kcal 0으로 저장하고 확인을 요구한다 */
    NONE("NONE");

    private final String value;

    NutritionSource(String value) {
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
}

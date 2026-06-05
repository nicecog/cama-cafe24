package com.cama.back.domain.schedule;


import com.cama.back.domain.api.EnumModel;

import java.util.Arrays;

public enum ScheduleType implements EnumModel {

	/*
	   A : 수면(SLEEP)
       B : 식습관(EATING)
       C : 신체활동(ACTIVITY)
       D : 심리(MENTALITY)
       E : 운동하기(EXERCISE) 
	 */
    MEDICINE("MEDICINE"),
    HOSPITAL("HOSPITAL"),
    ETC("ETC"),
    SLEEP("SLEEP"),
    EATING("EATING"),
    ACTIVITY("ACTIVITY"),
    MENTALITY("MENTALITY"),
    EXERCISE("EXERCISE");

    private final String value;

    ScheduleType(String value) {
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

    public static ScheduleType getStatusKey(String value) {
        return Arrays.stream(values())
                .filter(x -> x.value.equalsIgnoreCase(value))
                .findFirst()
                .orElse(null);
    }

}

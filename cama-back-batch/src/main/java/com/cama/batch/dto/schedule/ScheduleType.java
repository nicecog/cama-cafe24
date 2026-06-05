package com.cama.batch.dto.schedule;


import com.cama.batch.domain.api.EnumModel;

import java.util.Arrays;

public enum ScheduleType implements EnumModel {

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

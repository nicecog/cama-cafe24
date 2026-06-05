package com.cama.batch.domain.track;


import com.cama.batch.domain.api.EnumModel;

public enum TrackStatus implements EnumModel {

    CANCEL("CANCEL"),
    ACTIVE("ACTIVE");

    private final String value;

    TrackStatus(String value) {
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

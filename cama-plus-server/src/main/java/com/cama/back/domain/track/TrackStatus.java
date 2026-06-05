package com.cama.back.domain.track;


import com.cama.back.domain.api.EnumModel;

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

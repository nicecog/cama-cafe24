package com.cama.back.domain.hospital;


import com.cama.back.domain.api.EnumModel;

public enum ServiceStatus implements EnumModel {

    NOT_SERVICE("NOT_SERVICE"),
    REQUEST("REQUEST"),
    APPROVE("APPROVE"),
    CANCEL("CANCEL"),
    REJECT("REJECT");

    private final String value;

    ServiceStatus(String value) {
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

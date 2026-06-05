package com.cama.back.config.support;

public interface Pageable {

    long getOffset();

    int getPageSize();

    long getPageNumber();
}

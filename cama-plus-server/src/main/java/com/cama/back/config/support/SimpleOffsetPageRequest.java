package com.cama.back.config.support;

public class SimpleOffsetPageRequest implements Pageable {

    private final long offset;

    private final int limit;

    public SimpleOffsetPageRequest() {
        this(0, 20);
    }

    public SimpleOffsetPageRequest(long offset, int limit) {
        if (offset < 0)
            throw new IllegalArgumentException("Offset index must not be less than zero.");
        if (limit < 1)
            throw new IllegalArgumentException("Limit must not be less than one");

        this.offset = offset;
        this.limit = limit;
    }

    @Override
    public long getPageNumber() {
        return offset / limit;
    }

    @Override
    public long getOffset() {
        return offset;
    }

    @Override
    public int getPageSize() {
        return limit;
    }

}
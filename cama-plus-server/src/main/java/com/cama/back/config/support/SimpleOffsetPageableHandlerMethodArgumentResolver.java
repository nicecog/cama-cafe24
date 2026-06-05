package com.cama.back.config.support;

import org.apache.commons.lang3.math.NumberUtils;
import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

import static org.springframework.util.StringUtils.hasText;

public class SimpleOffsetPageableHandlerMethodArgumentResolver implements HandlerMethodArgumentResolver {

    private static final String DEFAULT_OFFSET_PARAMETER = "offset";

    private static final String DEFAULT_LIMIT_PARAMETER = "limit";

    private static final int DEFAULT_MAX_LIMIT_SIZE = 30;

    private static final SimpleOffsetPageRequest DEFAULT_PAGE_REQUEST = new SimpleOffsetPageRequest(0, 20);

    private SimpleOffsetPageRequest fallbackPageable = DEFAULT_PAGE_REQUEST;

    private String offsetParameterName = DEFAULT_OFFSET_PARAMETER;

    private String limitParameterName = DEFAULT_LIMIT_PARAMETER;

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        return Pageable.class.equals(parameter.getParameterType());
    }

    @Override
    public Object resolveArgument(
            MethodParameter methodParameter,
            ModelAndViewContainer mavContainer,
            NativeWebRequest webRequest,
            WebDataBinderFactory binderFactory
    ) {
        String offsetString = webRequest.getParameter(offsetParameterName);
        String limitSizeString = webRequest.getParameter(limitParameterName);

        boolean pageAndLimitGiven = hasText(offsetString) && hasText(limitSizeString);

        if (!pageAndLimitGiven && fallbackPageable == null)
            return null;

        long offset = hasText(offsetString) ? parseAndApplyBoundaries(offsetString, Integer.MAX_VALUE) : fallbackPageable.getOffset();
        int limit = hasText(limitSizeString) ? parseAndApplyBoundaries(limitSizeString, DEFAULT_MAX_LIMIT_SIZE) : fallbackPageable.getPageSize();

        limit = limit < 1 ? fallbackPageable.getPageSize() : limit;
        limit = limit > DEFAULT_MAX_LIMIT_SIZE ? DEFAULT_MAX_LIMIT_SIZE : limit;

        return new SimpleOffsetPageRequest(offset, limit);
    }

    private int parseAndApplyBoundaries(String parameter, int upper) {
        int parsed = NumberUtils.toInt(parameter, 0);
        return parsed < 0 ? 0 : parsed > upper ? upper : parsed;
    }

    public void setFallbackPageable(SimpleOffsetPageRequest fallbackPageable) {
        this.fallbackPageable = fallbackPageable;
    }

    public void setOffsetParameterName(String offsetParameterName) {
        this.offsetParameterName = offsetParameterName;
    }

    public void setLimitParameterName(String limitParameterName) {
        this.limitParameterName = limitParameterName;
    }

}
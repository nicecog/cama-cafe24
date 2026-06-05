package com.cama.back.security;


import org.springframework.security.access.AccessDecisionVoter;
import org.springframework.security.access.ConfigAttribute;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.FilterInvocation;

import jakarta.servlet.http.HttpServletRequest;
import java.util.Collection;

import static org.apache.commons.lang3.ClassUtils.isAssignable;

public class ConnectionBasedVoter implements AccessDecisionVoter<FilterInvocation> {

    @Override
    public int vote(Authentication authentication, FilterInvocation fi, Collection<ConfigAttribute> attributes) {
        HttpServletRequest request = fi.getRequest();
        return ACCESS_GRANTED;
    }

    @Override
    public boolean supports(ConfigAttribute attribute) {
        return true;
    }

    @Override
    public boolean supports(Class<?> clazz) {
        return isAssignable(FilterInvocation.class, clazz);
    }

}

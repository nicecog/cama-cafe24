package com.cama.back.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.GenericFilterBean;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.regex.Pattern;

import static java.util.stream.Collectors.toList;

public class JwtAuthenticationTokenFilter extends GenericFilterBean {

    private static final Pattern BEARER = Pattern.compile("^Bearer$", Pattern.CASE_INSENSITIVE);

    Logger log = LoggerFactory.getLogger(getClass());

    @Value("${jwt.token.header}")
    private String tokenHeader;

    @Autowired
    private JWT jwt;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {

        //System.out.println("Authentication Filter Start");

        HttpServletRequest request = (HttpServletRequest) req;
        HttpServletResponse response = (HttpServletResponse) res;

        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            String authorizationToken = obtainAuthorizationToken(request);
            if (authorizationToken != null) {
                try {
                    JWT.Claims claims = verify(request, authorizationToken);
                    log.debug("Jwt parse result: {}", claims);

                    // 만료 시점
                    if (canRefresh(claims, 1000 * 60)) {
                        String refreshedToken = jwt.refreshToken(authorizationToken);
                        response.setHeader(tokenHeader, refreshedToken);
                    }

                    Long userKey = claims.userKey;
                    //Email email = claims.email;
                    String nickName = claims.nickName;
                    String loginId = claims.loginId;
                    List<GrantedAuthority> authorities = obtainAuthorities(claims);

                    if (userKey != null && authorities.size() > 0) {
                        JwtAuthenticationToken authentication =
                                new JwtAuthenticationToken(new JwtAuthentication(userKey, loginId, nickName), null, authorities);
                        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authentication);
                    }
                } catch (Exception e) {
                    // 만료·손상된 토큰은 무시하고 체인 진행 (공개 API·permitAll 경로 500 방지)
                    log.warn("Jwt processing failed, continuing unauthenticated: {}", e.getMessage());
                    SecurityContextHolder.clearContext();
                }
            }
        } else {
            log.debug("SecurityContextHolder not populated with security token, as it already contained: '{}'",
                    SecurityContextHolder.getContext().getAuthentication());
        }

        chain.doFilter(request, response);
    }

    private boolean canRefresh(JWT.Claims claims, long refreshRangeMillis) {
        long exp = claims.exp();
        if (exp > 0) {
            long remain = exp - System.currentTimeMillis();
            return remain < refreshRangeMillis;
        }
        return false;
    }

    private List<GrantedAuthority> obtainAuthorities(JWT.Claims claims) {
        String[] roles = claims.roles;
        return roles == null || roles.length == 0 ?
                Collections.emptyList() :
                Arrays.stream(roles)
                        .map(role -> new SimpleGrantedAuthority("ROLE_" + role))
                        .collect(toList());
    }

    private String obtainAuthorizationToken(HttpServletRequest request) {

        String token = request.getHeader(tokenHeader);

        if (token != null) {
            if (log.isDebugEnabled())
                log.debug("Jwt authorization api detected: {}", token);
            try {
                token = URLDecoder.decode(token, "UTF-8");
                String[] parts = token.split(" ");
                if (parts.length == 2) {
                    String scheme = parts[0];
                    String credentials = parts[1];
                    return BEARER.matcher(scheme).matches() ? credentials : null;
                }
            } catch (UnsupportedEncodingException e) {
                log.error(e.getMessage(), e);
            }
        }

        return null;
    }

    private JWT.Claims verify(HttpServletRequest request, String token) {
        return jwt.verify(token);
    }

}

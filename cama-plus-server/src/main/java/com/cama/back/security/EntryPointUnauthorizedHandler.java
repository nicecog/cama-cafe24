package com.cama.back.security;

import com.cama.back.domain.api.ApiResult;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
public class EntryPointUnauthorizedHandler implements AuthenticationEntryPoint {

    private ObjectMapper om;

    public EntryPointUnauthorizedHandler(ObjectMapper om) {
        this.om = om;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException)
            throws IOException, ServletException {

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setHeader("content-type", "application/json");
        ApiResult body = new ApiResult(resolveMessage(authException), HttpStatus.UNAUTHORIZED);
        response.getWriter().write(om.writeValueAsString(body));
        response.getWriter().flush();
        response.getWriter().close();

    }

    private static String resolveMessage(AuthenticationException authException) {
        if (authException instanceof org.springframework.security.authentication.BadCredentialsException) {
            String msg = authException.getMessage();
            if (msg != null && !msg.isBlank() && !"Invalid credentials".equalsIgnoreCase(msg.trim())) {
                return msg;
            }
            return "아이디 또는 비밀번호가 올바르지 않습니다.";
        }
        if (authException instanceof org.springframework.security.core.userdetails.UsernameNotFoundException) {
            return "존재하지 않는 아이디입니다.";
        }
        return "로그인에 실패했습니다. 아이디와 비밀번호를 확인해 주세요.";
    }

}
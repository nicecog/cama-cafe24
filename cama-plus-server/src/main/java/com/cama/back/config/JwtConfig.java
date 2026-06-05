package com.cama.back.config;


import com.cama.back.security.JWT;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JwtConfig {

    @Value("${jwt.token.issuer}")
    String issuer;

    @Value("${jwt.token.clientSecret}")
    String clientSecret;


    @Value("${jwt.token.expirySeconds}")
    int expirySeconds;

    @Bean
    public JWT jwt() {
        return new JWT(issuer, clientSecret, expirySeconds);
    }

}

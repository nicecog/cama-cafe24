package com.cama.back.config;

import org.springframework.context.annotation.Bean;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;
import java.util.Collections;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class DevCorsFilterConfiguration {

    private final CamaHostingProperties hostingProperties;

    public DevCorsFilterConfiguration(CamaHostingProperties hostingProperties) {
        this.hostingProperties = hostingProperties;
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);

        var origins = hostingProperties.getCorsAllowedOrigins();
        if (origins.size() == 1 && "*".equals(origins.get(0))) {
            config.addAllowedOriginPattern("*");
        } else {
            origins.forEach(config::addAllowedOrigin);
        }

        config.setAllowedMethods(Arrays.asList("POST", "OPTIONS", "GET", "DELETE", "PUT", "PATCH"));
        config.setAllowedHeaders(Collections.singletonList("*"));
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }

}

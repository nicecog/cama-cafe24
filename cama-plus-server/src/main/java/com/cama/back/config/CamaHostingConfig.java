package com.cama.back.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(CamaHostingProperties.class)
public class CamaHostingConfig {
}

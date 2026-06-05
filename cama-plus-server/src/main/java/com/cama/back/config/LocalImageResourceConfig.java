package com.cama.back.config;

import com.cama.back.service.storage.LocalImageStorageService;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
@ConditionalOnProperty(name = "cama.hosting.storage-type", havingValue = "local")
public class LocalImageResourceConfig implements WebMvcConfigurer {

    private final LocalImageStorageService localImageStorageService;

    public LocalImageResourceConfig(LocalImageStorageService localImageStorageService) {
        this.localImageStorageService = localImageStorageService;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = localImageStorageService.getRootPath().toUri().toString();
        if (!location.endsWith("/")) {
            location += "/";
        }
        registry.addResourceHandler("/files/**")
                .addResourceLocations(location);
    }
}

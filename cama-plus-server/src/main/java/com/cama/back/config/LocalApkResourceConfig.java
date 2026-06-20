package com.cama.back.config;

import com.cama.back.service.storage.ApkStorageService;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class LocalApkResourceConfig implements WebMvcConfigurer {

    private final ApkStorageService apkStorageService;

    public LocalApkResourceConfig(ApkStorageService apkStorageService) {
        this.apkStorageService = apkStorageService;
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = apkStorageService.getRootPath().toUri().toString();
        if (!location.endsWith("/")) {
            location += "/";
        }
        registry.addResourceHandler("/apk_down/**")
                .addResourceLocations(location);
    }
}

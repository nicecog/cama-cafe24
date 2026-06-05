package com.cama.doctorweb.web;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

/**
 * Thymeleaf 전역 모델 (헤더 환경 표시 등)
 */
@ControllerAdvice
public class GlobalPageAttributes {

    @ModelAttribute("stageName")
    public String stageName() {
        return "(운영)";
    }
}

package com.cama.back.controller;

import io.swagger.v3.oas.annotations.Hidden;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Hidden
public class indexController {

    // 리스트
    @GetMapping(path = "/")
    public String getIndex() {
        return "cama-back";
    }

}

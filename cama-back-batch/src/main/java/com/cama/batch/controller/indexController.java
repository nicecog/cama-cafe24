package com.cama.batch.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class indexController {

    // 리스트
    @GetMapping(path = "/")
    public String getIndex() {
        return "cama-batch-back";
    }

}

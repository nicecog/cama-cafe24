package com.cama.tablet;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.cama.tablet.mapper")
public class RunApplication {

    public static void main(String[] args) {
        SpringApplication.run(RunApplication.class, args);
    }
}

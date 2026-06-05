package com.cama.back.controller.common;



import com.cama.back.domain.api.ApiResult;

import com.cama.back.dto.Base64Request;

import com.cama.back.exception.common.Base64InvalidFormatException;

import com.cama.back.security.JwtAuthentication;

import com.cama.back.service.storage.ImageStorageService;

import io.swagger.v3.oas.annotations.tags.Tag;

import io.swagger.v3.oas.annotations.Operation;

import org.apache.commons.lang3.RandomStringUtils;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.multipart.MultipartFile;

import org.springframework.web.multipart.MultipartHttpServletRequest;



import java.io.IOException;

import java.time.LocalDate;

import java.time.ZoneId;

import java.time.format.DateTimeFormatter;

import java.util.ArrayList;

import java.util.List;

import java.util.UUID;



import java.util.Base64;



@RestController

@RequestMapping("api")

@Tag(name = "공통 이미지 업로드 APIs")

public class CommonImageUploadRestController {



    private final ImageStorageService imageStorageService;



    public CommonImageUploadRestController(ImageStorageService imageStorageService) {

        this.imageStorageService = imageStorageService;

    }



    @PostMapping("common/images/upload")

    @Operation(summary = "메인 이미지 업로드")

    public ApiResult<List<String>> postMainImagesUpload(MultipartHttpServletRequest sr) throws IOException {



        List<MultipartFile> files = sr.getFiles("img");



        List<String> uploadedUrls = new ArrayList<>();



        for (MultipartFile file : files) {

            String fileName = file.getOriginalFilename() == null ? "" : file.getOriginalFilename();

            byte[] bytes = file.getBytes();

            String imageUrlName = createFileName(fileName).trim();

            String contentType = file.getContentType() != null ? file.getContentType() : "application/octet-stream";

            uploadedUrls.add(imageStorageService.upload(imageUrlName, bytes, contentType));

        }



        return new ApiResult<>(uploadedUrls);

    }



    @PostMapping("common/images/base64/upload")

    @Operation(summary = "Base64 이미지 업로드")

    public ApiResult<List<String>> postBase64ImagesUpload(

            @AuthenticationPrincipal JwtAuthentication authentication,

            @RequestBody Base64Request dto) {



        String[] base64Arrays = dto.getBase64().split(",");



        if (base64Arrays.length != 2) {

            throw new Base64InvalidFormatException();

        }



        String base64Data = base64Arrays[0];

        String fileType = base64Data.substring(base64Data.indexOf('/') + 1, base64Data.indexOf(';'));



        String base64Image = base64Arrays[1];

        byte[] bytes = Base64.getDecoder().decode(base64Image);



        String imageUrlName = createBase64FileName(createFileNameGenerator(fileType)).trim();

        String contentType = "image/" + fileType;

        String publicUrl = imageStorageService.upload(imageUrlName, bytes, contentType);



        return new ApiResult<>(List.of(publicUrl));

    }



    public static String createFileName(String fileOriginalName) {



        int pos = fileOriginalName.lastIndexOf(".");

        String extension = fileOriginalName.substring(pos + 1);



        String s1 = "upload/" + LocalDate.now(ZoneId.of("UTC")).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "/";

        s1 += UUID.randomUUID().toString().replace("-", "") + "." + extension;

        return s1;



    }



    public static String createBase64FileName(String fileOriginalName) {



        int pos = fileOriginalName.lastIndexOf(".");

        String extension = fileOriginalName.substring(pos + 1);



        String s1 = "upload/" + LocalDate.now(ZoneId.of("UTC")).format(DateTimeFormatter.ofPattern("yyyy-MM-dd")) + "/";

        s1 += UUID.randomUUID().toString().replace("-", "") + "." + extension;

        return s1;



    }



    public static String createFileNameGenerator(String type) {



        int length = 33;

        boolean useLetters = true;

        boolean useNumbers = false;

        return RandomStringUtils.random(length, useLetters, useNumbers) + "." + type;



    }





}


package com.cama.back.controller.doctor;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.doctor.ApkDeleteRequest;
import com.cama.back.dto.doctor.ApkReleaseDto;
import com.cama.back.service.storage.ApkStorageService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("api")
@Tag(name = "관리자 APK 관리 APIs")
public class DoctorApkRestController {

    private final ApkStorageService apkStorageService;

    public DoctorApkRestController(ApkStorageService apkStorageService) {
        this.apkStorageService = apkStorageService;
    }

    @PostMapping("doctor/apk/list")
    @Operation(summary = "APK 릴리스 목록")
    public ApiResult<List<ApkReleaseDto>> listReleases() throws IOException {
        return new ApiResult<>(apkStorageService.listReleases());
    }

    @PostMapping("doctor/apk/upload")
    @Operation(summary = "APK 업로드")
    public ApiResult<ApkReleaseDto> uploadApk(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "version", required = false) String version) throws IOException {
        return new ApiResult<>(apkStorageService.upload(file, version));
    }

    @PostMapping("doctor/apk/delete")
    @Operation(summary = "APK 삭제")
    public ApiResult<Boolean> deleteApk(@RequestBody ApkDeleteRequest request) throws IOException {
        apkStorageService.delete(request.getFileName());
        return new ApiResult<>(Boolean.TRUE);
    }
}

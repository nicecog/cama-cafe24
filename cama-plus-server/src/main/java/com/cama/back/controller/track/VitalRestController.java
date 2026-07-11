package com.cama.back.controller.track;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.track.VitalRecordDto;
import com.cama.back.dto.track.VitalRecordQuery;
import com.cama.back.dto.track.VitalRecordRequest;
import com.cama.back.security.JwtAuthentication;
import com.cama.back.service.track.VitalRecordService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api")
@Tag(name = "Vital")
@RequiredArgsConstructor
public class VitalRestController {

    private final VitalRecordService vitalRecordService;

    @PutMapping(path = "track/service/vital")
    @Operation(summary = "심박·생체신호 저장 (단건, 동일 시각·유형이면 갱신)")
    public ApiResult<Boolean> saveVital(@AuthenticationPrincipal JwtAuthentication authentication,
                                        @RequestBody VitalRecordRequest request) {
        try {
            vitalRecordService.save(authentication.id.value(), request);
            return new ApiResult<>(true);
        } catch (IllegalArgumentException e) {
            return new ApiResult<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping(path = "webview/track/service/vital")
    @Operation(summary = "심박·생체신호 저장 (WebView)")
    public ApiResult<Boolean> saveWebviewVital(@AuthenticationPrincipal JwtAuthentication authentication,
                                               @RequestBody VitalRecordRequest request) {
        try {
            Long acSeq = request.getAccountSeq() != null ? request.getAccountSeq() : authentication.id.value();
            vitalRecordService.save(acSeq, request);
            return new ApiResult<>(true);
        } catch (IllegalArgumentException e) {
            return new ApiResult<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "track/service/vital/batch")
    @Operation(summary = "심박·생체신호 일괄 저장")
    public ApiResult<Map<String, Integer>> saveVitalBatch(@AuthenticationPrincipal JwtAuthentication authentication,
                                                          @RequestBody List<VitalRecordRequest> requests) {
        try {
            int saved = vitalRecordService.saveBatch(authentication.id.value(), requests);
            return new ApiResult<>(Map.of("saved", saved));
        } catch (IllegalArgumentException e) {
            return new ApiResult<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "webview/track/service/vital/batch")
    @Operation(summary = "심박·생체신호 일괄 저장 (WebView)")
    public ApiResult<Map<String, Integer>> saveWebviewVitalBatch(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                 @RequestBody List<VitalRecordRequest> requests) {
        try {
            if (requests == null || requests.isEmpty()) {
                throw new IllegalArgumentException("저장할 생체신호가 없습니다.");
            }
            Long accountSeq = requests.get(0).getAccountSeq() != null
                    ? requests.get(0).getAccountSeq()
                    : authentication.id.value();
            int saved = vitalRecordService.saveBatch(accountSeq, requests);
            return new ApiResult<>(Map.of("saved", saved));
        } catch (IllegalArgumentException e) {
            return new ApiResult<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "track/service/vitalList")
    @Operation(summary = "심박·생체신호 이력 조회")
    public ApiResult<List<VitalRecordDto>> getVitalList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                        @RequestBody VitalRecordQuery query) {
        try {
            query.setAccountSeq(authentication.id.value());
            return new ApiResult<>(vitalRecordService.list(query));
        } catch (IllegalArgumentException e) {
            return new ApiResult<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "webview/track/service/vitalList")
    @Operation(summary = "심박·생체신호 이력 조회 (WebView)")
    public ApiResult<List<VitalRecordDto>> getWebviewVitalList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                               @RequestBody VitalRecordQuery query) {
        try {
            if (query.getAccountSeq() == null) {
                query.setAccountSeq(authentication.id.value());
            }
            return new ApiResult<>(vitalRecordService.list(query));
        } catch (IllegalArgumentException e) {
            return new ApiResult<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}

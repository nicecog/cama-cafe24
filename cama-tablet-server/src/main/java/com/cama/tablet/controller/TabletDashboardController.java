package com.cama.tablet.controller;

import com.cama.tablet.domain.ApiResult;
import com.cama.tablet.dto.DashboardResponse;
import com.cama.tablet.dto.QrScanRequest;
import com.cama.tablet.service.TabletDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/tablet")
@RequiredArgsConstructor
public class TabletDashboardController {

    private final TabletDashboardService dashboardService;

    @GetMapping("/health")
    public ApiResult<String> health() {
        return ApiResult.ok("cama-tablet-server ok");
    }

    /** QR 스캔 직후 — 페이로드 파싱 + 대시보드 집계 한 번에 */
    @PostMapping("/scan")
    public ApiResult<DashboardResponse> scan(@RequestBody QrScanRequest request) {
        try {
            return ApiResult.ok(dashboardService.resolveScan(request));
        } catch (IllegalArgumentException e) {
            return ApiResult.fail(e.getMessage());
        }
    }

    /** accountSeq 로 대시보드 재조회 */
    @GetMapping("/dashboard/{accountSeq}")
    public ApiResult<DashboardResponse> dashboard(@PathVariable Long accountSeq) {
        try {
            return ApiResult.ok(dashboardService.buildDashboard(accountSeq));
        } catch (IllegalArgumentException e) {
            return ApiResult.fail(e.getMessage());
        }
    }
}

package com.cama.tablet.controller;

import com.cama.tablet.config.TabletQrProperties;
import com.cama.tablet.domain.ApiResult;
import com.cama.tablet.dto.QrIssueRequest;
import com.cama.tablet.dto.QrIssueResponse;
import com.cama.tablet.service.TabletQrTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("api/tablet/qr")
@RequiredArgsConstructor
public class TabletQrController {

    private final TabletQrTokenService tokenService;
    private final TabletQrProperties properties;

    /**
     * 로컬 개발용 — 프로덕션에서는 cama-plus-server 의 인증 발급 API 사용.
     * cama.tablet.qr.allow-dev-issue=true + devKey 일치 시에만 허용.
     */
    @PostMapping("/issue")
    public ApiResult<QrIssueResponse> issue(@RequestBody QrIssueRequest request) {
        if (!properties.isAllowDevIssue()) {
            return ApiResult.fail("QR 발급은 환자 앱(cama-plus-server)에서만 가능합니다.");
        }
        if (properties.getDevIssueKey() != null
                && !properties.getDevIssueKey().isBlank()
                && !properties.getDevIssueKey().equals(request.getDevKey())) {
            return ApiResult.fail("devKey가 올바르지 않습니다.");
        }
        if (request.getAccountSeq() == null || request.getLoginId() == null || request.getLoginId().isBlank()) {
            return ApiResult.fail("accountSeq, loginId 가 필요합니다.");
        }
        try {
            return ApiResult.ok(toResponse(tokenService.issue(request.getAccountSeq(), request.getLoginId())));
        } catch (IllegalArgumentException e) {
            return ApiResult.fail(e.getMessage());
        }
    }

    private static QrIssueResponse toResponse(TabletQrTokenService.IssuedToken issued) {
        QrIssueResponse res = new QrIssueResponse();
        res.setToken(issued.getToken());
        res.setQrPayload(issued.getQrPayload());
        res.setExpiresAtEpochMs(issued.getExpiresAtEpochMs());
        res.setTtlSeconds(issued.getTtlSeconds());
        return res;
    }
}

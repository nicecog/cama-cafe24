package com.cama.back.controller.tablet;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.tablet.TabletQrIssueRsp;
import com.cama.back.security.JwtAuthentication;
import com.cama.back.service.tablet.TabletQrTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/tablet/qr")
@RequiredArgsConstructor
@ConditionalOnProperty(prefix = "cama.tablet.qr", name = "secret")
public class TabletQrRestController {

    private final TabletQrTokenService tabletQrTokenService;

    /**
     * 로그인한 환자 본인용 태블릿 QR 발급 (서명·만료 적용).
     * 응답의 qrPayload 문자열을 QR 이미지로 인코딩하면 됩니다.
     */
    @PostMapping("/issue")
    public ApiResult<TabletQrIssueRsp> issue(@AuthenticationPrincipal JwtAuthentication authentication) {
        if (authentication == null || authentication.id == null) {
            return new ApiResult<>("로그인이 필요합니다.", org.springframework.http.HttpStatus.UNAUTHORIZED);
        }
        long accountSeq = authentication.id.value();
        String loginId = authentication.loginId;
        TabletQrTokenService.IssuedToken issued = tabletQrTokenService.issue(accountSeq, loginId);

        TabletQrIssueRsp rsp = new TabletQrIssueRsp();
        rsp.setToken(issued.getToken());
        rsp.setQrPayload(issued.getQrPayload());
        rsp.setExpiresAtEpochMs(issued.getExpiresAtEpochMs());
        rsp.setTtlSeconds(issued.getTtlSeconds());
        return new ApiResult<>(rsp);
    }
}

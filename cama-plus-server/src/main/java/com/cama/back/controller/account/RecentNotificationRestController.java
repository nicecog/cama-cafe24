package com.cama.back.controller.account;


import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.account.RecentNotificationRsp;
import com.cama.back.mapper.AccountMapper;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api")
@Tag(name = "최근 알림 APIs")
public class RecentNotificationRestController {

    private final AccountMapper accountMapper;

    public RecentNotificationRestController(AccountMapper accountMapper) {
        this.accountMapper = accountMapper;
    }

    @GetMapping(path = "notification/recent")
    @Operation(summary = "최근 알림 리스트")
    public ApiResult<List<RecentNotificationRsp>> getNotificationRecentList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                            SearchParam searchParam) {

        Long acSeq = authentication.id.value();
        searchParam.setAcSeq(acSeq);

        int totalCount = accountMapper.getRecentNotificationCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<RecentNotificationRsp> list = accountMapper.getRecentNotification(searchParam);

        return new ApiResult<>(list, pagination);

    }

    @GetMapping(path = "webview/notification/recent")
    @Operation(summary = "최근 알림 리스트")
    public ApiResult<List<RecentNotificationRsp>> getWebviewNotificationRecentList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                            SearchParam searchParam) {

        //Long acSeq = searchParam.getAcSeq();
        //searchParam.setAcSeq(acSeq);

        int totalCount = accountMapper.getRecentNotificationCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<RecentNotificationRsp> list = accountMapper.getRecentNotification(searchParam);

        return new ApiResult<>(list, pagination);

    }

}

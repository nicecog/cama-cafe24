package com.cama.back.controller.admin;


import com.cama.back.AppContext;
import com.cama.back.domain.account.Account;
import com.cama.back.domain.account.AccountRole;
import com.cama.back.domain.admin.CmAdmin;
import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.account.AccountCheckRequest;
import com.cama.back.dto.admin.AdminAccountRsp;
import com.cama.back.dto.admin.AdminPasswordRequest;
import com.cama.back.exception.account.AccountNotFoundException;
import com.cama.back.mapper.AccountMapper;
import com.cama.back.repo.account.AccountRepository;
import com.cama.back.repo.account.CmAdminRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@RestController
@RequestMapping("api/admin")
@Tag(name = "관리자 유저 APIs")
public class AdminAccountRestController {

    private final AccountMapper accountMapper;
    private final AccountRepository accountRepository;
    private final CmAdminRepository cmAdminRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminAccountRestController(AccountMapper accountMapper, AccountRepository accountRepository, CmAdminRepository cmAdminRepository, PasswordEncoder passwordEncoder) {
        this.accountMapper = accountMapper;
        this.accountRepository = accountRepository;
        this.cmAdminRepository = cmAdminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping(path = "account/list")
    @Operation(summary = "유저 리스트")
    public ApiResult<List<AdminAccountRsp>> getAdminAccountList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                @RequestParam(required = false, value = "page") Integer page) {

        SearchParam param = SearchParam.builder().build();
        param.setPage(page == null ? 1 : page);

        int totalCount = accountMapper.getAdminAccountListCount(param);
        Pagination pagination = new Pagination(param.getPage(), totalCount);
        param.setPagination(pagination);

        List<AdminAccountRsp> list = accountMapper.getAdminAccountList(param);

        return new ApiResult<>(list, pagination);

    }

    @GetMapping(path = "account/{accountSeq}/view")
    @Operation(summary = "유저 상세")
    public ApiResult<AdminAccountRsp> getAdminAccountView(@AuthenticationPrincipal JwtAuthentication authentication,
                                                          @PathVariable Long accountSeq) {

        if (!accountMapper.getAdminAccountView(accountSeq).isPresent()) {
            throw new AccountNotFoundException();
        }

        AdminAccountRsp accountRsp = accountMapper.getAdminAccountView(accountSeq).get();
        return new ApiResult<>(accountRsp);

    }

    @PutMapping(path = "account/{accountSeq}/disabled")
    @Operation(summary = "유저 활성 및 비활성화")
    public ApiResult<Boolean> putAdminAccountDisabled(@AuthenticationPrincipal JwtAuthentication authentication,
                                                      @PathVariable Long accountSeq) {

        if (!accountRepository.findById(accountSeq).isPresent()) {
            throw new AccountNotFoundException();
        }

        Account account = accountRepository.findById(accountSeq).get();

        if (account.isDropped()) {
            account.setDropped(false);
            account.setDroppedOutDate(null);
            account.setDropReason(null);
        } else {
            account.setDropped(true);
            account.setDroppedOutDate(AppContext.LOCAL_DATE_TIME());
            account.setDropReason("관리자 강제 DROP");
        }

        accountRepository.save(account);

        return new ApiResult<>(true);

    }



    @PutMapping(path = "account/{accountSeq}/password")
    @Operation(summary = "유저 비밀번호 강제 변경")
    public ApiResult<Boolean> putAdminAccountPassword(@AuthenticationPrincipal JwtAuthentication authentication,
                                                      @PathVariable Long accountSeq,
                                                      @RequestBody AdminPasswordRequest dto) {

        if (!accountRepository.findById(accountSeq).isPresent()) {
            throw new AccountNotFoundException();
        }

        Account account = accountRepository.findById(accountSeq).get();
        account.setPassword(passwordEncoder.encode(dto.getPassword()));
        accountRepository.save(account);

        return new ApiResult<>(true);

    }

    @GetMapping(path = "account/admin/member")
    @Operation(summary = "관리자 리스트")
    public ApiResult<List<AdminAccountRsp>> getAdminMemberList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                               @RequestParam(required = false, value = "page") Integer page) {

        SearchParam param = SearchParam.builder().build();
        param.setPage(page == null ? 1 : page);

        int totalCount = accountMapper.getAdminMemberListCount(param);
        Pagination pagination = new Pagination(param.getPage(), totalCount);
        param.setPagination(pagination);

        List<AdminAccountRsp> list = accountMapper.getAdminMemberList(param);

        return new ApiResult<>(list, pagination);

    }

    @PostMapping(path = "account/admin/check")
    @Operation(summary = "관리자 메일 중복 체크")
    public ApiResult<Boolean> postAccountMemberEmailCheck(@AuthenticationPrincipal JwtAuthentication authentication,
                                                          @RequestBody AccountCheckRequest dto) {

        checkArgument(isNotEmpty(dto.getEmail()), "EMAIL 값은 필수 입니다.");
        return new ApiResult<>(accountRepository.findByEmailAndEnabledAndDropped(dto.getEmail(), true, false).isPresent());

    }

    @GetMapping(path = "account/me")
    @Operation(summary = "관리자 정보")
    public ApiResult<CmAdmin> getAdminAccount(@AuthenticationPrincipal JwtAuthentication authentication) {

        String loginId = authentication.loginId;

        if (cmAdminRepository.findByLoginIdAndEnabled(loginId, true).isEmpty()) {
            throw new AccountNotFoundException(loginId);
        }

        CmAdmin admin = cmAdminRepository.findByLoginIdAndEnabled(loginId, true).get();
        return new ApiResult<>(admin);

    }


}

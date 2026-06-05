package com.cama.back.controller.authentication;


import com.cama.back.domain.account.AccountSecure;
import com.cama.back.domain.account.LoginType;
import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.account.AccountSecureRequest;
import com.cama.back.exception.account.AccountNotFoundException;
import com.cama.back.exception.account.AccountSecureNotFoundException;
import com.cama.back.repo.account.AccountRepository;
import com.cama.back.repo.account.AccountSecureRepository;
import com.cama.back.security.*;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@RestController
@RequestMapping("api")
@Tag(name = "로그인 APIs (토큰 필요없음)")
public class AuthenticationRestController {

    private final AuthenticationManager authenticationManager;
    private final AccountRepository accountRepository;
    private final AccountSecureRepository accountSecureRepository;

    public AuthenticationRestController(AuthenticationManager authenticationManager, AccountRepository accountRepository,
                                        AccountSecureRepository accountSecureRepository) {
        this.authenticationManager = authenticationManager;
        this.accountRepository = accountRepository;
        this.accountSecureRepository = accountSecureRepository;
    }

    @PostMapping(path = "auth")
    @Operation(summary = "로그인")
    public ApiResult<AuthenticationResult> authentication(@RequestBody AuthenticationRequest dto) {

        if (dto.getCredentials() == null || dto.getCredentials().isBlank()) {
            throw new IllegalArgumentException("credentials is required");
        }

        JwtAuthenticationToken authToken =
                new JwtAuthenticationToken(dto.getPrincipal(), dto.getCredentials(), dto.getFirebase(), LoginType.GENERAL);

        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new ApiResult<>((AuthenticationResult) authentication.getDetails());

    }

    @PostMapping(path = "auth/pass")
    @Operation(summary = "PASS 로그인")
    public ApiResult<AuthenticationResult> authenticationPassApp(@RequestBody AuthenticationPassRequest dto) {

        JwtAuthenticationToken authToken =
                new JwtAuthenticationToken(dto.getImpUid(), dto.getFirebase(), LoginType.PASS);

        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new ApiResult<>((AuthenticationResult) authentication.getDetails());

    }

    @PostMapping(path = "auth/doctor")
    @Operation(summary = "의사 로그인")
    public ApiResult<AuthenticationDoctorResult> authenticationHospital(@RequestBody AuthRequest dto) {

        JwtAuthenticationToken authToken =
                new JwtAuthenticationToken(dto.getPrincipal(), dto.getCredentials(), LoginType.DOCTOR);

        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new ApiResult<>((AuthenticationDoctorResult) authentication.getDetails());

    }

    @PostMapping(path = "auth/admin")
    @Operation(summary = "관리자 로그인")
    public ApiResult<AuthenticationAdminResult> authenticationAdmin(@RequestBody AuthRequest dto) {

        JwtAuthenticationToken authToken =
                new JwtAuthenticationToken(dto.getPrincipal(), dto.getCredentials(), LoginType.ADMIN);

        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new ApiResult<>((AuthenticationAdminResult) authentication.getDetails());

    }

    @PostMapping(path = "auth/secure")
    @Operation(summary = "관계자 로그인")
    public ApiResult<AuthenticationResult> authenticationSecure(@RequestBody AccountSecureRequest dto) {

        checkArgument(isNotEmpty(dto.getSecureCode()), "코드 값은 필수 입니다.");

        if (!accountSecureRepository.findBySecureCodeAndEnabled(dto.getSecureCode(), true).isPresent()) {
            throw new AccountSecureNotFoundException();
        }

        AccountSecure secure = accountSecureRepository.findBySecureCodeAndEnabled(dto.getSecureCode(), true).get();
        if (!accountRepository.findById(secure.getAccountSeq()).isPresent()) {
            throw new AccountNotFoundException();
        }

        String impUid = accountRepository.findById(secure.getAccountSeq()).get().getImpUid();

        JwtAuthenticationToken authToken =
                new JwtAuthenticationToken(impUid, dto.getFirebase(), LoginType.PASS);

        Authentication authentication = authenticationManager.authenticate(authToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return new ApiResult<>((AuthenticationResult) authentication.getDetails());

    }

//    @PostMapping(path = "auth/sns")
//    @Operation(summary = "SNS 회원 로그인(가입)")
//    public ApiResult<AuthenticationResult> snsAuthentication(@RequestBody SnsRequest dto) {
//
//        SnsRsp snsRsp = accountService.snsData(dto, false);
//
//        String snsEmail = snsRsp.getEmail();
//        String nickName = snsRsp.getNickName();
//
//        if (snsEmail != null) {
//
//            if (accountRepository.findByEmailAndEnabledAndDropped(snsEmail, true, false).isEmpty()) {
//
//                accountService.signUpSns(AccountRequest.builder()
//                        .email(snsEmail)
//                        .nickName(nickName)
//                        .signType(dto.getSignType())
//                        .build());
//            }
//
//            Account account = accountRepository.findByEmailAndEnabledAndDropped(snsEmail, true, false).get();
//            if (account.getSignType().equals(SignType.DEFAULT)) {
//                throw new SiteLoginTargetException(snsEmail);
//            }
//
//            // 토큰 파이어베이스 토큰 설정
//            accountService.firebaseToken(account, dto.getFirebase());
//
//            JwtAuthenticationToken authToken = new JwtAuthenticationToken(account.getLoginId(), "1234", true);
//            Authentication authentication = authenticationManager.authenticate(authToken);
//            SecurityContextHolder.getContext().setAuthentication(authentication);
//
//            return new ApiResult<>((AuthenticationResult) authentication.getDetails());
//
//        } else {
//            throw new UnauthorizedException("SNS EMAIL NOT FOUND ERROR");
//        }
//
//    }

}

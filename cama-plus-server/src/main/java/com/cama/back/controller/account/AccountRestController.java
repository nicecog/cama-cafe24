package com.cama.back.controller.account;


import com.cama.back.AppContext;
import com.cama.back.domain.account.*;
import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.firebase.FirebaseToken;
import com.cama.back.domain.iamport.IamportResponseCertification;
import com.cama.back.dto.account.*;
import com.cama.back.dto.coaching.QuestionInfo;
import com.cama.back.dto.iamport.IamportCertRsp;
import com.cama.back.dto.iamport.IamportRequest;
import com.cama.back.dto.sns.SnsRsp;
import com.cama.back.exception.account.AccountNotFoundException;
import com.cama.back.exception.account.AccountSecureNotFoundException;
import com.cama.back.exception.common.SnsMemberNotUsedException;
import com.cama.back.exception.hospital.HospitalServiceNotFoundException;
import com.cama.back.mapper.HospitalMapper;
import com.cama.back.repo.account.AccountAlarmRepository;
import com.cama.back.repo.account.AccountRepository;
import com.cama.back.repo.account.AccountSecureRepository;
import com.cama.back.repo.firebase.FirebaseTokenRepository;
import com.cama.back.security.JwtAuthentication;
import com.cama.back.service.account.AccountService;
import com.cama.back.service.account.BiometricAccountService;
import com.cama.back.service.account.PatientAccountService;
import com.cama.back.service.iamport.IamportService;
import com.cama.back.mapper.AccountMapper;
import com.cama.back.util.JhUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@RestController
@RequestMapping("api")
@Tag(name = "유저 APIs")
public class AccountRestController {

    private final AccountRepository accountRepository;
    private final AccountAlarmRepository accountAlarmRepository;
    private final FirebaseTokenRepository firebaseTokenRepository;
    private final HospitalMapper hospitalMapper;
    private final PasswordEncoder passwordEncoder;
    private final JhUtil jhUtil;
    private final IamportService iamportService;
    private final AccountService accountService;
    private final AccountMapper accountMapper;
    private final PatientAccountService patientAccountService;
    private final BiometricAccountService biometricAccountService;

    public AccountRestController(AccountRepository accountRepository,
                                 AccountAlarmRepository accountAlarmRepository,
                                 FirebaseTokenRepository firebaseTokenRepository, HospitalMapper hospitalMapper, PasswordEncoder passwordEncoder,
                                 JhUtil jhUtil, IamportService iamportService, AccountService accountService, AccountMapper accountMapper,
                                 PatientAccountService patientAccountService,
                                 BiometricAccountService biometricAccountService) {
        this.accountRepository = accountRepository;
        this.accountAlarmRepository = accountAlarmRepository;
        this.firebaseTokenRepository = firebaseTokenRepository;
        this.hospitalMapper = hospitalMapper;
        this.passwordEncoder = passwordEncoder;
        this.jhUtil = jhUtil;
        this.iamportService = iamportService;
        this.accountService = accountService;
        this.accountMapper = accountMapper;
        this.patientAccountService = patientAccountService;
        this.biometricAccountService = biometricAccountService;
    }

    @PostMapping(path = "account")
    @Operation(summary = "회원 가입")
    @Transactional
    public ApiResult<Boolean> postAccount(@RequestBody AccountRequest dto) {

        //checkArgument(isNotEmpty(dto.getEmail()), "로그인 이메일 값은 필수 입니다.");
        //checkArgument(jhUtil.checkEmail(dto.getEmail()), "이메일 형식이 아닙니다.");

        checkArgument(isNotEmpty(dto.getImpUid()), "아임포트 값은 필수 입니다.");
        //checkArgument(isNotEmpty(dto.getFirebase().getToken()), "파베 토큰 값은 필수 입니다.");

//        if (dto.getSignType().equals(SignType.DEFAULT)) {
//            checkArgument(isNotEmpty(dto.getPassword()), "비밀번호 값은 필수 입니다.");
//            checkArgument(jhUtil.checkPassword(dto.getPassword()), "비밀번호는 숫자, 문자, 특수문자 1개 이상이며 '최소 8자에서 최대 20자'까지 허용됩니다.");
//        }

        // 일반 회원 가입
        if (dto.getSignType().equals(SignType.DEFAULT)) {
            accountService.signUpDefault(dto);
        } else {
            throw new SnsMemberNotUsedException();
        }

        return new ApiResult<>(true);

    }

    @PostMapping(path = "account/general")
    @Operation(summary = "일반 회원 가입")
    @Transactional
    public ApiResult<Boolean> postGeneralAccount(@RequestBody AccountRequest dto) {

        //checkArgument(isNotEmpty(dto.getEmail()), "로그인 이메일 값은 필수 입니다.");
        //checkArgument(jhUtil.checkEmail(dto.getEmail()), "이메일 형식이 아닙니다.");
    	
    	checkArgument(isNotEmpty(dto.getLoginId()),  "로그인id 값은 필수 입니다.");

        //checkArgument(isNotEmpty(dto.getImpUid()), "아임포트 값은 필수 입니다.");
        checkArgument(isNotEmpty(dto.getFirebase().getToken()), "파베 토큰 값은 필수 입니다.");

        if (dto.getSignType().equals(SignType.GENERAL)) {
            checkArgument(isNotEmpty(dto.getPassword()), "비밀번호 값은 필수 입니다.");
            //checkArgument(jhUtil.checkPassword(dto.getPassword()), "비밀번호는 숫자, 문자, 특수문자 1개 이상이며 '최소 8자에서 최대 20자'까지 허용됩니다.");
        }

        // 일반 회원 가입
        if (dto.getSignType().equals(SignType.GENERAL)) {
            accountService.signUpGeneralDefault(dto);
        } else {
            throw new SnsMemberNotUsedException();
        }

        return new ApiResult<>(true);

    }

    @PostMapping(path = "account/general/login")
    @Operation(summary = "일반 회원 로그인")
    @Transactional
    public ApiResult<Account> getGeneralAccoutLogin(@RequestBody AccountRequest dto) {

    	checkArgument(isNotEmpty(dto.getLoginId()),  "로그인id 값은 필수 입니다.");
        checkArgument(isNotEmpty(dto.getPassword()), "비밀번호 값은 필수 입니다.");
        
        String loginId = dto.getLoginId();

        if (accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false).isEmpty()) {
            throw new AccountNotFoundException(loginId);
        }

        Account account = accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false).get();
        
        //System.out.println("account.getPassword()" + account.getPassword());
        //System.out.println("dto.getPassword()" + dto.getPassword());
        //System.out.println("passwordEncoder.encode(dto.getPassword())" + passwordEncoder.encode(dto.getPassword()));
                
        checkArgument(passwordEncoder.matches(dto.getPassword(), account.getPassword()), "두 비밀번호가 일치하지 않습니다.");
        
        return new ApiResult<>(account);

    }

    @PutMapping(path = "account")
    @Operation(summary = "회원 수정(핸드폰 번호)")
    @Transactional
    public ApiResult<Boolean> putAccount(@AuthenticationPrincipal JwtAuthentication authentication,
                                         @RequestBody AccountCertRequest dto) {

//        String email = authentication.email;
//
//        Account account = accountRepository.findByEmailAndEnabledAndDropped(email, true, false)
//                .orElseThrow(() -> new AccountNotFoundException(email));
//
//
//        IamportResponseCertification cert = iamportService.checkCertification(dto.getImpUid());
//
//        if (cert.getCode() != 0) {
//            throw new IamportCertException(cert.getMessage());
//        }
//
//        String impUid = cert.getResponse().getImpUid();
//        String name = cert.getResponse().getName();
//        String phone = cert.getResponse().getPhone();
//        Gender gender = cert.getResponse().getGender().equals("male") ? Gender.MALE : Gender.FEMALE;
//        String birthday = cert.getResponse().getBirthday();
//
//        if (accountRepository.findByNameAndPhoneAndEnabledAndDropped(name, phone, true, false).isPresent()) {
//            throw new AlreadyAccountDuplicateException(name);
//        }
//
//        account.setImpUid(impUid);
//        account.setPhone(phone);
//        account.setName(name);
//        account.setBirth(birthday);
//        account.setGender(gender);
//
//        accountRepository.saveAndFlush(account);

        return new ApiResult<>(true);

    }

    @PutMapping(path = "account/nickName")
    @Operation(summary = "회원 수정(닉네임)")
    @Transactional
    public ApiResult<Boolean> putAccountNickName(@AuthenticationPrincipal JwtAuthentication authentication,
                                                 @RequestBody NickNameRequest dto) {

//        String email = authentication.email;
//
//        checkArgument(isNotEmpty(dto.getNickName()), "닉네임 값은 필수 입니다.");
//
//        Account account = accountRepository.findByEmailAndEnabledAndDropped(email, true, false)
//                .orElseThrow(() -> new AccountNotFoundException(email));
//
//        account.setNickName(dto.getNickName());
//        accountRepository.saveAndFlush(account);

        return new ApiResult<>(true);

    }

    @GetMapping(path = "account/me")
    @Operation(summary = "회원 정보")
    public ApiResult<Account> getAccount(@AuthenticationPrincipal JwtAuthentication authentication) {

        String loginId = authentication.loginId;
        int procCnt = 0;

        if (accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false).isEmpty()) {
            throw new AccountNotFoundException(loginId);
        }

        Account account = accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false).get();
        boolean isOwner = account.getRoles().stream().anyMatch(x -> x.equals(AccountRole.ADMIN));
        if (isOwner) {
            // 관리자가 승인 했는지 확인
            //if (!account.isAdminChecked()) {
            //throw new OwnerAdminNotConfirmException();
            //}
        }
        
        //사용자별 로그인 이력 생성  
        procCnt = accountMapper.insertAccountLoginHst(account.getSeq());

        return new ApiResult<>(account);

    }

    @PostMapping(path = "webview/account/me")
    @Operation(summary = "회원 정보")
    public ApiResult<Account> getWebviewAccount(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody Account dto) {

        String loginId = dto.getLoginId();
        int procCnt = 0;

        if (accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false).isEmpty()) {
            throw new AccountNotFoundException(loginId);
        }

        Account account = accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false).get();
        
        //사용자별 로그인 이력 생성  
        //procCnt = accountMapper.insertAccountLoginHst(account.getSeq());

        return new ApiResult<>(account);

    }

    @PostMapping(path = "webview/account/update")
    @Operation(summary = "회원 상세정보 수정 (이름/전화/이메일/성별/생년월일)")
    public ApiResult<PatientProfileUpdateResponse> postWebviewAccountUpdate(
            @RequestBody PatientProfileUpdateRequest dto) {
        return new ApiResult<>(patientAccountService.updateProfile(dto));
    }

    @PostMapping(path = "webview/account/change-password")
    @Operation(summary = "회원 비밀번호 변경 (현재 비밀번호 확인 + 선택 시 안내 메일)")
    public ApiResult<PatientChangePasswordResponse> postWebviewAccountChangePassword(
            @RequestBody PatientChangePasswordRequest dto) {
        return new ApiResult<>(patientAccountService.changePassword(dto));
    }

    @PostMapping(path = "webview/account/biometric/status")
    @Operation(summary = "생체 로그인 상태 조회")
    public ApiResult<BiometricStatusResponse> postBiometricStatus(@RequestBody BiometricStatusRequest dto) {
        return new ApiResult<>(biometricAccountService.status(dto));
    }

    @PostMapping(path = "webview/account/biometric/enroll")
    @Operation(summary = "생체 로그인 기기 등록")
    public ApiResult<BiometricEnrollResponse> postBiometricEnroll(@RequestBody BiometricEnrollRequest dto) {
        return new ApiResult<>(biometricAccountService.enroll(dto));
    }

    @PostMapping(path = "webview/account/biometric/login")
    @Operation(summary = "생체 로그인")
    public ApiResult<BiometricLoginResponse> postBiometricLogin(@RequestBody BiometricLoginRequest dto) {
        return new ApiResult<>(biometricAccountService.login(dto));
    }

    @PostMapping(path = "webview/account/biometric/decline")
    @Operation(summary = "생체 로그인 안내 나중에")
    public ApiResult<BiometricSimpleResponse> postBiometricDecline(@RequestBody BiometricDeclineRequest dto) {
        return new ApiResult<>(biometricAccountService.decline(dto));
    }

    @PostMapping(path = "webview/account/biometric/disable")
    @Operation(summary = "생체 로그인 해제")
    public ApiResult<BiometricSimpleResponse> postBiometricDisable(@RequestBody BiometricDisableRequest dto) {
        return new ApiResult<>(biometricAccountService.disable(dto));
    }

    @PostMapping(path = "account/sns/check")
    @Operation(summary = "SNS 회원 체크")
    public ApiResult<?> postAccountSnsCheck(@RequestBody SignUpCheckRequest dto) {

        checkArgument(isNotEmpty(dto.getToken()), "토큰 값은 필수 입니다.");

        if (dto.getSignType() == null) {
            checkArgument(false, "SNS 타입 값은 필수 입니다.");
        } else {
            if (dto.getSignType().equals(SignType.APPLE)) {
                checkArgument(isNotEmpty(dto.getAppleId()), "APPLE ID 값은 필수 입니다.");
            }
        }

        SnsRsp snsRsp = accountService.snsData(SnsRequest.builder()
                .appleId(dto.getAppleId())
                .token(dto.getToken())
                .signType(dto.getSignType())
                .build(), true);

        String email = snsRsp.getEmail();

        if (accountRepository.findByEmailAndEnabledAndDropped(email, true, false).isPresent()) {
            return new ApiResult<>(true);
        } else {
            return new ApiResult<>(false);
        }

    }

    @PostMapping(path = "account/check")
    @Operation(summary = "중복 회원 체크")
    public ApiResult<Boolean> postAccountCheck(@AuthenticationPrincipal JwtAuthentication authentication,
                                               @RequestBody AccountCheckRequest dto) {

        checkArgument(isNotEmpty(dto.getEmail()), "EMAIL 값은 필수 입니다.");
        return new ApiResult<>(accountRepository.findByEmailAndEnabledAndDropped(dto.getEmail(), true, false).isPresent());

    }

    @PostMapping(path = "account/withdrawal")
    @Operation(summary = "회원 탈퇴")
    public ApiResult<Boolean> postAccountWithdrawal(@AuthenticationPrincipal JwtAuthentication authentication) {

        String loginId = authentication.loginId;

        if (!accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false).isPresent()) {
            throw new AccountNotFoundException(loginId);
        }

        Account account = accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false).get();

//        switch (account.getSignType()){
//            case APPLE:
//                break;
//            case GOOGLE:
//                break;
//            case KAKAO:
//                checkArgument(isNotEmpty(dto.getToken()), "토큰 값은 필수 입니다.");
//                accountService.dropKakao(dto.getToken());
//                break;
//            case NAVER:
//                break;
//            default:
//
//        }

        account.setDropped(true);
        account.setDroppedOutDate(AppContext.LOCAL_DATE_TIME());

        accountRepository.save(account);

        return new ApiResult<>(true);

    }
    
    @PostMapping(path = "webview/account/withdrawal")
    @Operation(summary = "회원 탈퇴")
    public ApiResult<Boolean> postWebviewAccountWithdrawal(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody Account dto) {

        String loginId = dto.getLoginId();

        if (!accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false).isPresent()) {
            throw new AccountNotFoundException(loginId);
        }

        Account account = accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false).get();

//        switch (account.getSignType()){
//            case APPLE:
//                break;
//            case GOOGLE:
//                break;
//            case KAKAO:
//                checkArgument(isNotEmpty(dto.getToken()), "토큰 값은 필수 입니다.");
//                accountService.dropKakao(dto.getToken());
//                break;
//            case NAVER:
//                break;
//            default:
//
//        }

        account.setDropped(true);
        account.setDroppedOutDate(AppContext.LOCAL_DATE_TIME());

        accountRepository.save(account);

        return new ApiResult<>(true);

    }


    @PostMapping(path = "account/find/id/check")
    @Operation(summary = "아이디 검증")
    public ApiResult<Boolean> postAccountFindIdCheck(@AuthenticationPrincipal JwtAuthentication authentication,
                                                     @RequestBody AccountFindRequest dto) {

        checkArgument(isNotEmpty(dto.getEmail()), "이메일 값은 필수 입니다.");
        checkArgument(jhUtil.checkEmail(dto.getEmail()), "이메일 형식이 아닙니다.");
        checkArgument(isNotEmpty(dto.getImpUid()), "imp_uid 값은 필수 입니다.");

        String email = dto.getEmail();

        IamportResponseCertification cert = iamportService.checkCertification(dto.getImpUid());

        String name = cert.getResponse().getName();
        String phone = cert.getResponse().getPhone();

        return new ApiResult<>(accountRepository.findByEmailAndNameAndPhoneAndEnabledAndDropped(email, name, phone, true, false).isPresent());

    }

    @PutMapping(path = "account/pwd")
    @Operation(summary = "비밀번호 변경")
    public ApiResult<Boolean> putAccountPassword(@AuthenticationPrincipal JwtAuthentication authentication,
                                                 @RequestBody AccountPwdRequest dto) {

        IamportResponseCertification certification = iamportService.checkCertification(dto.getImpUid());

        String name = certification.getResponse().getName();
        String phone = certification.getResponse().getPhone();

        Account account = accountRepository.findByNameAndPhoneAndEnabledAndDropped(name, phone, true, false)
                .orElseThrow(AccountNotFoundException::new);

        if (account.getSignType().equals(SignType.DEFAULT)) {

            checkArgument(isNotEmpty(dto.getImpUid()), "아임포트 값은 필수 입니다.");

            checkArgument(isNotEmpty(dto.getPassword()), "비밀번호 값은 필수 입니다.");
            checkArgument(isNotEmpty(dto.getPasswordCheck()), "비밀번호 확인 값은 필수 입니다.");

            checkArgument(jhUtil.checkSamePassword(dto.getPassword(), dto.getPasswordCheck()), "두 비밀번호가 일치하지 않습니다.");

            account.setPassword(passwordEncoder.encode(dto.getPassword()));
            accountRepository.saveAndFlush(account);

        }


        return new ApiResult<>(true);

    }

    @PostMapping(path = "account/iamport")
    @Operation(summary = "아임포트 번호로 이름 핸드폰 번호 얻어오기")
    public ApiResult<IamportCertRsp> getAccountNameAndPhoneWithIamport(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                       @RequestBody IamportRequest dto) {

        checkArgument(isNotEmpty(dto.getImpUid()), "아임포트 값은 필수 입니다.");

        IamportResponseCertification certification = iamportService.checkCertification(dto.getImpUid());

        String name = certification.getResponse().getName();
        String phone = certification.getResponse().getPhone();
        String birth = certification.getResponse().getBirthday();
        String impUid = certification.getResponse().getImpUid();

        return new ApiResult<>(IamportCertRsp.builder()
                .name(name)
                .phone(phone)
                .birth(birth)
                .impUid(impUid)
                .build());

    }

    @PostMapping(path = "account/sign/check")
    @Operation(summary = "아임포트로 가입 여부 확인")
    public ApiResult<Boolean> getAccountSignCheck(@AuthenticationPrincipal JwtAuthentication authentication,
                                                  @RequestBody IamportRequest dto) {

        checkArgument(isNotEmpty(dto.getImpUid()), "아임포트 값은 필수 입니다.");

        IamportResponseCertification certification = iamportService.checkCertification(dto.getImpUid());

        String name = certification.getResponse().getName();
        String phone = certification.getResponse().getPhone();

        return new ApiResult<>(accountRepository.findByNameAndPhoneAndEnabledAndDropped(name, phone, true, false).isPresent());

    }

//    @PutMapping(path = "account/nick")
//    @Operation(summary = "닉네임 변경")
//    public ApiResult<Boolean> putAccountNick(@AuthenticationPrincipal JwtAuthentication authentication,
//                                             @RequestBody AccountNickRequest dto) {
//
//
//        String email = authentication.email;
//
//        checkArgument(isNotEmpty(dto.getNickName()), "닉네임은 필수 입니다.");
//
//        Account account = accountRepository.findByEmailAndEnabledAndDropped(email, true, false)
//                .orElseThrow(() -> new AccountNotFoundException(email));
//
//        account.setNickName(dto.getNickName().trim());
//
//        accountRepository.save(account);
//
//        return new ApiResult<>(true);
//
//    }
//
//    @PutMapping(path = "account/profile/image")
//    @Operation(summary = "프로필 사진 변경")
//    public ApiResult<Boolean> putAccountProfileImage(@AuthenticationPrincipal JwtAuthentication authentication,
//                                                     @RequestBody AccountProfileImageRequest dto) {
//
//        String email = authentication.email;
//
//        if (!accountRepository.findByEmailAndEnabledAndDropped(email, true, false).isPresent()) {
//            throw new AccountNotFoundException();
//        }
//
//        Account account = accountRepository.findByEmailAndEnabledAndDropped(email, true, false).get();
//
//        // 기본 이미지
//        if (dto.getProfileImage() == null) {
//            account.setProfileImage("https://d2wzajvlsrz16a.cloudfront.net/common/default.jpg");
//        } else {
//            account.setProfileImage(dto.getProfileImage());
//        }
//
//        accountRepository.save(account);
//
//        return new ApiResult<>(true);
//
//    }

    @GetMapping(path = "account/alarm")
    @Operation(summary = "알림 설정 정보")
    public ApiResult<AccountAlarmRsp> getAccountAlarm(@AuthenticationPrincipal JwtAuthentication authentication) {

        Long accountSeq = authentication.id.value();

        if (accountAlarmRepository.findByAccountSeqAndEnabled(accountSeq, true).isPresent()) {
            AccountAlarm alarm = accountAlarmRepository.findByAccountSeqAndEnabled(accountSeq, true).get();
            return new ApiResult<>(AccountAlarmRsp.builder()
                    .noticed(alarm.isNoticed())
                    .answered(alarm.isAnswered())
                    .build());
        } else {
            return new ApiResult<>(AccountAlarmRsp.builder()
                    .noticed(false)
                    .answered(false)
                    .build());
        }

    }

    @PutMapping(path = "account/alarm")
    @Operation(summary = "알림 설정 수정")
    public ApiResult<Boolean> putAccountAlarm(@AuthenticationPrincipal JwtAuthentication authentication,
                                              @RequestBody AccountAlarmRequest dto) {

        Long accountSeq = authentication.id.value();

        if (accountAlarmRepository.findByAccountSeqAndEnabled(accountSeq, true).isPresent()) {

            AccountAlarm alarm = accountAlarmRepository.findByAccountSeqAndEnabled(accountSeq, true).get();
            alarm.setNoticed(dto.isNoticed());
            alarm.setAnswered(dto.isAnswered());

            accountAlarmRepository.save(alarm);

        } else {
            accountAlarmRepository.save(AccountAlarm.builder()
                    .accountSeq(accountSeq)
                    .noticed(dto.isNoticed())
                    .answered(dto.isAnswered())
                    .enabled(true)
                    .build());
        }

        return new ApiResult<>(true);

    }

    @PutMapping(path = "account/firebase/init")
    @Operation(summary = "파이어베이스 초기화")
    public ApiResult<Boolean> putAccountFirebaseInit(@AuthenticationPrincipal JwtAuthentication authentication) {

        Long acSeq = authentication.id.value();

        if (firebaseTokenRepository.findByAccountSeqAndEnabled(acSeq, true).isPresent()) {
            FirebaseToken firebaseToken = firebaseTokenRepository.findByAccountSeqAndEnabled(acSeq, true).get();
            firebaseToken.setEnabled(false);
            firebaseTokenRepository.save(firebaseToken);
        }

        return new ApiResult<>(true);

    }

    @PutMapping(path = "account/login-id")
    @Operation(summary = "로그인 ID 변경")
    @Transactional
    public ApiResult<ChangeLoginIdResponse> changeLoginId(
            @AuthenticationPrincipal JwtAuthentication authentication,
            @RequestBody ChangeLoginIdRequest dto) {

        checkArgument(isNotEmpty(dto.getNewLoginId()), "새 로그인 ID는 필수입니다.");
        checkArgument(isNotEmpty(dto.getCredentials()), "비밀번호는 필수입니다.");

        ChangeLoginIdResponse response = accountService.changeLoginId(
                authentication.id.value(),
                authentication.loginId,
                dto);

        return new ApiResult<>(response);
    }

    @GetMapping(path = "account/hospital")
    @Operation(summary = "내 병원 정보")
    public ApiResult<AccountHospitalRsp> getAccountHospital(@AuthenticationPrincipal JwtAuthentication authentication) {

        Long acSeq = authentication.id.value();

        if (!hospitalMapper.getMyHospitalInfo(acSeq).isPresent()) {
            throw new HospitalServiceNotFoundException();
        }

        AccountHospitalRsp accountHospitalRsp = hospitalMapper.getMyHospitalInfo(acSeq).get();
        return new ApiResult<>(accountHospitalRsp);

    }

    @PostMapping(path = "webview/account/hospital")
    @Operation(summary = "내 병원 정보")
    public ApiResult<AccountHospitalRsp> getWebviewAccountHospital(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody Account dto) {

        Long acSeq = dto.getSeq();

        if (!hospitalMapper.getMyHospitalInfo(acSeq).isPresent()) {
            throw new HospitalServiceNotFoundException();
        }

        AccountHospitalRsp accountHospitalRsp = hospitalMapper.getMyHospitalInfo(acSeq).get();
        return new ApiResult<>(accountHospitalRsp);

    }

}

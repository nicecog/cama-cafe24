package com.cama.back.service.account;

import com.cama.back.AppContext;
import com.cama.back.domain.account.Account;
import com.cama.back.domain.account.AccountRole;
import com.cama.back.domain.account.Gender;
import com.cama.back.domain.account.SignType;
import com.cama.back.domain.admin.CmAdmin;
import com.cama.back.domain.apple.IdTokenPayload;
import com.cama.back.domain.doctor.CmDoctor;
import com.cama.back.domain.firebase.FbTokenPayload;
import com.cama.back.domain.firebase.Firebase;
import com.cama.back.domain.firebase.FirebaseToken;
import com.cama.back.domain.firebase.Platform;
import com.cama.back.domain.iamport.IamportResponseCertification;
import com.cama.back.dto.account.AccountRequest;
import com.cama.back.dto.account.ChangeLoginIdRequest;
import com.cama.back.dto.account.ChangeLoginIdResponse;
import com.cama.back.dto.account.SnsRequest;
import com.cama.back.dto.sns.KakaoSnsRsp;
import com.cama.back.dto.sns.NaverSnsRsp;
import com.cama.back.dto.sns.SnsRsp;
import com.cama.back.exception.account.AccountNotFoundException;
import com.cama.back.exception.account.AlreadyAccountDuplicateException;
import com.cama.back.exception.common.PasswordNotMatchingException;
import com.cama.back.exception.iamport.IamportCertException;
import com.cama.back.exception.sns.SnsDataBindingException;
import com.cama.back.repo.account.AccountAuthInfo;
import com.cama.back.repo.account.AccountRepository;
import com.cama.back.security.JWT;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import com.cama.back.repo.account.CmAdminRepository;
import com.cama.back.repo.doctor.CmDoctorRepository;
import com.cama.back.repo.firebase.FirebaseTokenRepository;
import com.cama.back.service.iamport.IamportService;
import com.cama.back.util.AppleLoginUtil;
import com.cama.back.util.JhUtil;
import io.jsonwebtoken.io.Decoders;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.HashSet;

@Service
public class AccountServiceImpl implements AccountService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final FirebaseTokenRepository firebaseTokenRepository;
    private final CmDoctorRepository cmDoctorRepository;
    private final CmAdminRepository cmAdminRepository;
    private final RestTemplate restTemplate;
    private final IamportService iamportService;
    private final JhUtil jhUtil;
    private final JWT jwt;

    @Value("${naver.oauth.client-id:}")
    private String naverClientId;

    @Value("${naver.oauth.client-secret:}")
    private String naverClientSecret;

    public AccountServiceImpl(AccountRepository accountRepository, PasswordEncoder passwordEncoder, FirebaseTokenRepository firebaseTokenRepository,
                              CmDoctorRepository cmDoctorRepository, CmAdminRepository cmAdminRepository, RestTemplate restTemplate, IamportService iamportService, JhUtil jhUtil, JWT jwt) {
        this.accountRepository = accountRepository;
        this.passwordEncoder = passwordEncoder;
        this.firebaseTokenRepository = firebaseTokenRepository;
        this.cmDoctorRepository = cmDoctorRepository;
        this.cmAdminRepository = cmAdminRepository;
        this.restTemplate = restTemplate;
        this.iamportService = iamportService;
        this.jhUtil = jhUtil;
        this.jwt = jwt;
    }

    @Override
    public Account login(String principal, String password) {

        Optional<AccountAuthInfo> authInfoOpt = accountRepository.findAuthInfoByLoginId(principal);
        Optional<String> passwordHashOpt = accountRepository.findPasswordHashByLoginId(principal);

        if (authInfoOpt.isEmpty() || passwordHashOpt.isEmpty()) {
            authInfoOpt = accountRepository.findAuthInfoByEmail(principal);
            passwordHashOpt = accountRepository.findPasswordHashByEmail(principal);
        }

        if (authInfoOpt.isEmpty() || passwordHashOpt.isEmpty()) {
            throw new UsernameNotFoundException(principal);
        }

        if (!passwordEncoder.matches(password, passwordHashOpt.get())) {
            throw new PasswordNotMatchingException();
        }

        AccountAuthInfo authInfo = authInfoOpt.get();
        Set<AccountRole> roles = new HashSet<>();
        for (String roleName : accountRepository.findRoleNamesByAccountSeq(authInfo.getSeq())) {
            roles.add(AccountRole.valueOf(roleName));
        }
        if (roles.isEmpty()) {
            roles.add(AccountRole.USER);
        }

        Account account = new Account();
        account.setSeq(authInfo.getSeq());
        account.setLoginId(authInfo.getLoginId());
        account.setNickName(authInfo.getNickName());
        account.setName(authInfo.getName());
        account.setSignType(authInfo.getSignType());
        account.setRoles(roles);
        account.setPassword(passwordHashOpt.get());
        return account;
    }

    @Override
    public Account loginPassApp(String impUid) {

        IamportResponseCertification cert = iamportService.checkCertification(impUid);

        if (cert.getCode() != 0) {
            throw new IamportCertException(cert.getMessage());
        }

        String name = cert.getResponse().getName();
        String phone = cert.getResponse().getPhone();

        if (!accountRepository.findByNameAndPhoneAndEnabledAndDropped(name, phone, true, false).isPresent()) {
            throw new AccountNotFoundException();
        }

        return accountRepository.findByNameAndPhoneAndEnabledAndDropped(name, phone, true, false).get();

    }

    @Override
    public CmDoctor loginDoctor(String loginId, String password) {
        boolean present = cmDoctorRepository.findByLoginIdAndEnabled(loginId, true).isPresent();

        if (!present) {
            throw new UsernameNotFoundException(loginId);
        }

        CmDoctor cmDoctor = cmDoctorRepository.findByLoginIdAndEnabled(loginId, true).get();
        cmDoctor.login(passwordEncoder, password);

        return cmDoctor;
    }

    @Override
    public CmAdmin loginAdmin(String loginId, String password) {

        boolean present = cmAdminRepository.findByLoginIdAndEnabled(loginId, true).isPresent();

        if (!present) {
            throw new UsernameNotFoundException(loginId);
        }

        CmAdmin admin = cmAdminRepository.findByLoginIdAndEnabled(loginId, true).get();
        admin.login(passwordEncoder, password);

        return admin;
    }

    @Override
    public void signUpDefault(AccountRequest dto) {

        IamportResponseCertification cert = iamportService.checkCertification(dto.getImpUid());

        if (cert.getCode() != 0) {
            throw new IamportCertException(cert.getMessage());
        }

        String name = cert.getResponse().getName();
        String phone = cert.getResponse().getPhone();
        Gender gender = cert.getResponse().getGender().equals("male") ? Gender.MALE : Gender.FEMALE;
        String birthday = cert.getResponse().getBirthday();
        String impUid = cert.getResponse().getImpUid();

        if (accountRepository.findByNameAndPhoneAndEnabledAndDropped(name, phone, true, false).isPresent()) {
            throw new AlreadyAccountDuplicateException(name);
        }

        String rndPassword = jhUtil.generateRandomString(33).toLowerCase();

        Account account = accountRepository.saveAndFlush(Account.builder()
                .loginId(generateLoginId())
                .email(null)
                .name(name)
                .phone(phone)
                .birth(birthday)
                .gender(gender)
                .impUid(impUid)
                .password(passwordEncoder.encode(rndPassword))
                .signType(dto.getSignType())
                .roles(new HashSet<>(Collections.singletonList(AccountRole.USER)))
                .enabled(true)
                .dropped(false)
                .userTypeCd("20")
                .lang("KO")
                .build());

        if (dto.getFirebase() != null) {
            firebaseTokenRepository.saveAndFlush(FirebaseToken.builder()
                    .accountSeq(account.getSeq())
                    .token(dto.getFirebase().getToken())
                    .platform(dto.getFirebase().getPlatform())
                    .device(dto.getFirebase().getDevice())
                    .enabled(true)
                    .build());
        }

    }


    @Override
    public void signUpGeneralDefault(AccountRequest dto) {

        //IamportResponseCertification cert = iamportService.checkCertification(dto.getImpUid());

        //if (cert.getCode() != 0) {
        //    throw new IamportCertException(cert.getMessage());
        //}

        String loginId = dto.getLoginId();
        String name = dto.getName();
        String phone = dto.getPhone();
        Gender gender = dto.getGender();
        String birthday = dto.getBirthday();
        String password = dto.getPassword();
        String lang = "US";
        
        if (dto.getLang() != null) lang = dto.getLang();

        if (accountRepository.findByNameAndPhoneAndEnabledAndDropped(name, phone, true, false).isPresent()) {
            throw new AlreadyAccountDuplicateException(name);
        }

        //String rndPassword = jhUtil.generateRandomString(33).toLowerCase();

        Account account = accountRepository.saveAndFlush(Account.builder()
                .loginId(loginId)
                .email(null)
                .name(name)
                .phone(phone)
                .birth(birthday)
                .gender(gender)
                .impUid(null)
                .password(passwordEncoder.encode(password))
                .signType(dto.getSignType())
                .roles(new HashSet<>(Collections.singletonList(AccountRole.USER)))
                .enabled(true)
                .dropped(false)
                .userTypeCd("20")
                .lang(lang)
                .build());

        if (dto.getFirebase() != null) {
            firebaseTokenRepository.saveAndFlush(FirebaseToken.builder()
                    .accountSeq(account.getSeq())
                    .token(dto.getFirebase().getToken())
                    .platform(dto.getFirebase().getPlatform())
                    .device(dto.getFirebase().getDevice())
                    .enabled(true)
                    .build());
        }

    }

    @Override
    public void signUpSns(AccountRequest dto) {

        Account account = accountRepository.saveAndFlush(Account.builder()
                //.email(dto.getEmail().trim())
                .nickName(dto.getNickName())
                .password(passwordEncoder.encode("1234"))
                .signType(dto.getSignType())
                .roles(new HashSet<>(Collections.singletonList(AccountRole.USER)))
                .enabled(true)
                .dropped(false)
                .build());

    }

    @Override
    public void firebaseToken(Account account, Firebase firebase) {

        if (firebase != null) {

            String token = firebase.getToken();
            Platform platform = firebase.getPlatform();
            String device = firebase.getDevice();

            if (!token.equals("test")) {

                if (firebaseTokenRepository.findByAccountSeqAndEnabled(account.getSeq(), true).isPresent()) {
                    FirebaseToken firebaseToken = firebaseTokenRepository.findByAccountSeqAndEnabled(account.getSeq(), true).get();

                    if (!firebaseToken.getToken().equals(token)) {
                        firebaseToken.setPlatform(platform);
                        firebaseToken.setDevice(device);
                        firebaseToken.setToken(token);
                        firebaseTokenRepository.saveAndFlush(firebaseToken);
                    }
                } else {
                    firebaseTokenRepository.saveAndFlush(
                            FirebaseToken.builder()
                                    .accountSeq(account.getSeq())
                                    .platform(platform)
                                    .device(device)
                                    .token(token)
                                    .enabled(true)
                                    .build());
                }

            }

        }


    }

    @Override
    public SnsRsp snsData(SnsRequest dto, boolean appleCheck) {

        String token = dto.getToken();
        SignType signType = dto.getSignType();

        String header = "Bearer " + token;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.add("Authorization", header);
        HttpEntity<String> request = new HttpEntity<>(headers);

        if (signType.equals(SignType.NAVER)) {


            ResponseEntity<NaverSnsRsp> naver = restTemplate.exchange("https://openapi.naver.com/v1/nid/me",
                    HttpMethod.GET, request, NaverSnsRsp.class);

            if (naver.getBody() != null) {

                if (naver.getBody().getResultcode().equals("00")) {

                    String email = naver.getBody().getResponse().getEmail();
                    String nickName = naver.getBody().getResponse().getNickname();

                    return SnsRsp.builder().email(email).nickName(nickName).build();

                }

            }

            throw new SnsDataBindingException(naver.getBody().getMessage());

        } else if (signType.equals(SignType.KAKAO)) {

            ResponseEntity<String> kakao = restTemplate.exchange("https://kapi.kakao.com/v2/user/me",
                    HttpMethod.GET, request, String.class);

            if (kakao.getBody() != null) {
                KakaoSnsRsp kakaoRsp = AppContext.GSON.fromJson(kakao.getBody(), KakaoSnsRsp.class);

                String email = kakaoRsp.getKakao_account().getEmail();
                String nickname = kakaoRsp.getKakao_account().getProfile().getNickname();

                return SnsRsp.builder().email(email).nickName(nickname).build();
            }

            throw new SnsDataBindingException("KAKAO TOKEN ERROR");

        } else if (signType.equals(SignType.APPLE)) {

            if (appleCheck) {

                String payload = dto.getToken().split("\\.")[1];
                String decoded = new String(Decoders.BASE64.decode(payload));
                IdTokenPayload idTokenPayload = AppContext.GSONC.fromJson(decoded, IdTokenPayload.class);
                return SnsRsp.builder().email(idTokenPayload.getEmail()).nickName(dto.getAppleId()).build();
            } else {
                IdTokenPayload idTokenPayload = AppleLoginUtil.appleAuth(dto.getToken());
                if (idTokenPayload != null) {
                    return SnsRsp.builder().email(idTokenPayload.getEmail()).nickName(dto.getAppleId()).build();
                }
            }

            throw new SnsDataBindingException("APPLE TOKEN ERROR");

        } else if (signType.equals(SignType.GOOGLE)) {

            String payload = dto.getToken().split("\\.")[1];
            String decoded = new String(Decoders.BASE64.decode(payload));
            FbTokenPayload fbTokenPayload = AppContext.GSONC.fromJson(decoded, FbTokenPayload.class);
            return SnsRsp.builder().email(fbTokenPayload.getEmail()).nickName(fbTokenPayload.getName()).build();

        } else {
            throw new IllegalStateException();
        }
    }

    @Override
    public ResponseEntity<String> dropKakao(String token) {

        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + token);
        headers.add("Content-Type", "application/x-www-form-urlencoded");

        HttpEntity<?> request = new HttpEntity<>(headers);

        String apiCallUrl = "https://kapi.kakao.com/v1/user/unlink";

        ResponseEntity<String> res;
        res = restTemplate.exchange(apiCallUrl, HttpMethod.POST, request, String.class);
        return res;

    }

    @Override
    public ResponseEntity<String> dropNaver(String token) {

        HttpHeaders headers = new HttpHeaders();
        //headers.add("Authorization", "Bearer " + dto.getToken());

        HttpEntity<?> request = new HttpEntity<>(headers);

        String clientId = naverClientId;
        String clientSecret = naverClientSecret;
        String apiCallUrl = "https://nid.naver.com/oauth2.0/token?grant_type=delete" +
                "&client_id=" + clientId + "&client_secret=" + clientSecret + "&access_token=" + token + "&service_provider=NAVER";

        ResponseEntity<String> res;
        res = restTemplate.exchange(apiCallUrl, HttpMethod.GET, request, String.class);
        return res;


    }

    @Override
    @Transactional
    public ChangeLoginIdResponse changeLoginId(Long accountSeq, String currentLoginId, ChangeLoginIdRequest request) {
        checkArgument(request != null, "요청 값이 필요합니다.");
        checkArgument(isNotBlank(request.getNewLoginId()), "새 로그인 ID는 필수입니다.");
        checkArgument(isNotBlank(request.getCredentials()), "비밀번호는 필수입니다.");

        String newLoginId = request.getNewLoginId().trim();
        checkArgument(jhUtil.isCheckId(newLoginId), "ID는 영문/숫자 4~20자만 사용할 수 있습니다.");

        Account account = accountRepository.findById(accountSeq)
                .orElseThrow(() -> new AccountNotFoundException(currentLoginId));

        if (!account.getSignType().equals(SignType.GENERAL) && !account.getSignType().equals(SignType.DEFAULT)) {
            throw new AccountNotFoundException("로그인 ID 변경을 지원하지 않는 계정입니다.");
        }

        if (newLoginId.equalsIgnoreCase(account.getLoginId())) {
            throw new IllegalArgumentException("현재 ID와 동일합니다.");
        }

        if (accountRepository.existsByLoginIdAndEnabledAndDropped(newLoginId, true, false)) {
            throw new AlreadyAccountDuplicateException(newLoginId);
        }

        login(currentLoginId, request.getCredentials());

        // Patient data (coaching, track, schedule, firebase, etc.) is keyed by account.seq,
        // not login_id. Only public.account.login_id needs to change for patients.
        accountRepository.updateLoginIdBySeq(accountSeq, newLoginId);

        if (accountRepository.countBySeqAndLoginId(accountSeq, currentLoginId) > 0) {
            throw new IllegalStateException("로그인 ID 변경 후에도 이전 ID가 account 테이블에 남아 있습니다.");
        }

        account = accountRepository.findById(accountSeq)
                .orElseThrow(() -> new AccountNotFoundException(currentLoginId));
        if (!newLoginId.equals(account.getLoginId())) {
            throw new IllegalStateException("로그인 ID 변경이 반영되지 않았습니다.");
        }

        String[] roles = account.getRoles() == null
                ? new String[] { AccountRole.USER.name() }
                : account.getRoles().stream().map(AccountRole::name).toArray(String[]::new);
        String apiToken = account.newApiToken(jwt, roles);

        return ChangeLoginIdResponse.builder()
                .apiToken(apiToken)
                .account(account)
                .message("로그인 ID가 변경되었습니다.")
                .build();
    }

    private String generateLoginId() {

        String code = jhUtil.generateRandomString(13);
        if (accountRepository.existsByLoginIdAndEnabledAndDropped(code, true, false)) {
            generateLoginId();
        }
        return code;
    }

}

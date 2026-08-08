package com.cama.back.service.account;

import com.cama.back.domain.account.*;
import com.cama.back.domain.firebase.FirebaseToken;
import com.cama.back.dto.account.*;
import com.cama.back.exception.account.AccountNotFoundException;
import com.cama.back.exception.account.AlreadyAccountDuplicateException;
import com.cama.back.repo.account.AccountRecoveryInfo;
import com.cama.back.repo.account.AccountRepository;
import com.cama.back.repo.firebase.FirebaseTokenRepository;
import com.cama.back.service.email.EmailService;
import com.cama.back.util.JhUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
public class PatientAccountServiceImpl implements PatientAccountService {

    private static final Logger log = LoggerFactory.getLogger(PatientAccountServiceImpl.class);

    private final AccountRepository accountRepository;
    private final FirebaseTokenRepository firebaseTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JhUtil jhUtil;
    private final EmailService emailService;
    private final AccountService accountService;
    private final BiometricAccountService biometricAccountService;

    public PatientAccountServiceImpl(
            AccountRepository accountRepository,
            FirebaseTokenRepository firebaseTokenRepository,
            PasswordEncoder passwordEncoder,
            JhUtil jhUtil,
            EmailService emailService,
            AccountService accountService,
            @Lazy BiometricAccountService biometricAccountService) {
        this.accountRepository = accountRepository;
        this.firebaseTokenRepository = firebaseTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jhUtil = jhUtil;
        this.emailService = emailService;
        this.accountService = accountService;
        this.biometricAccountService = biometricAccountService;
    }

    @Override
    public PatientAvailabilityResponse checkLoginIdAvailable(String loginId) {
        validateLoginIdFormat(loginId);
        boolean available = !accountRepository.existsByLoginIdAndEnabledAndDropped(loginId.trim(), true, false);
        return PatientAvailabilityResponse.builder()
                .available(available)
                .message(available ? "사용 가능한 ID입니다." : "이미 사용 중인 ID입니다.")
                .build();
    }

    @Override
    public PatientAvailabilityResponse checkEmailAvailable(String email) {
        if (isBlank(email)) {
            return PatientAvailabilityResponse.builder()
                    .available(true)
                    .message("이메일은 선택 입력입니다.")
                    .build();
        }
        validateEmailFormat(email);
        boolean available = !accountRepository.existsByEmailAndEnabledAndDropped(email.trim(), true, false);
        return PatientAvailabilityResponse.builder()
                .available(available)
                .message(available ? "사용 가능한 이메일입니다." : "이미 등록된 이메일입니다.")
                .build();
    }

    @Override
    public PatientAvailabilityResponse checkPhoneAvailable(String phone) {
        validatePhoneFormat(phone);
        String normalized = normalizePhone(phone);
        boolean available = !accountRepository.existsByPhoneAndEnabledAndDropped(normalized, true, false);
        return PatientAvailabilityResponse.builder()
                .available(available)
                .message(available ? "사용 가능한 전화번호입니다." : "이미 등록된 전화번호입니다.")
                .build();
    }

    @Override
    public PatientAvailabilityResponse checkPatientNumberAvailable(String patientManagementNumber) {
        if (isBlank(patientManagementNumber)) {
            return PatientAvailabilityResponse.builder()
                    .available(true)
                    .message("환자번호는 선택 입력입니다.")
                    .build();
        }
        String trimmed = patientManagementNumber.trim();
        boolean available = !accountRepository.existsByPatientManagementNumberAndEnabledAndDropped(trimmed, true, false);
        return PatientAvailabilityResponse.builder()
                .available(available)
                .message(available ? "사용 가능한 환자번호입니다." : "이미 등록된 환자번호입니다.")
                .build();
    }

    @Override
    @Transactional
    public void register(PatientRegisterRequest request) {
        validateRegisterRequest(request);

        String loginId = request.getLoginId().trim();
        String email = blankToNull(request.getEmail());
        String phone = normalizePhone(request.getPhone());
        String name = request.getName().trim();

        if (!checkLoginIdAvailable(loginId).isAvailable()) {
            throw new AlreadyAccountDuplicateException(loginId);
        }
        if (isNotBlank(email) && !checkEmailAvailable(email).isAvailable()) {
            throw new AlreadyAccountDuplicateException(email);
        }
        if (!checkPhoneAvailable(request.getPhone()).isAvailable()) {
            throw new AlreadyAccountDuplicateException(phone);
        }
        if (isNotBlank(request.getPatientManagementNumber())
                && !checkPatientNumberAvailable(request.getPatientManagementNumber()).isAvailable()) {
            throw new AlreadyAccountDuplicateException(request.getPatientManagementNumber());
        }

        String lang = isNotBlank(request.getLang()) ? request.getLang() : "KO";

        Account account = accountRepository.saveAndFlush(Account.builder()
                .loginId(loginId)
                .email(email)
                .name(name)
                .phone(phone)
                .birth(request.getBirthday())
                .gender(request.getGender())
                .patientManagementNumber(blankToNull(request.getPatientManagementNumber()))
                .password(passwordEncoder.encode(request.getPassword()))
                .signType(SignType.GENERAL)
                .roles(new HashSet<>(Collections.singletonList(AccountRole.USER)))
                .enabled(true)
                .dropped(false)
                .userTypeCd("20")
                .lang(lang)
                .build());

        if (request.getFirebase() != null && isNotBlank(request.getFirebase().getToken())) {
            firebaseTokenRepository.saveAndFlush(FirebaseToken.builder()
                    .accountSeq(account.getSeq())
                    .token(request.getFirebase().getToken())
                    .platform(request.getFirebase().getPlatform())
                    .device(request.getFirebase().getDevice())
                    .enabled(true)
                    .build());
        }
    }

    @Override
    public PatientFindLoginIdResponse findLoginId(PatientFindLoginIdRequest request) {
        checkArgument(isNotBlank(request.getName()), "이름은 필수입니다.");
        checkArgument(isNotBlank(request.getPhone()), "전화번호는 필수입니다.");
        validatePhoneFormat(request.getPhone());

        String name = request.getName().trim();
        String phone = normalizePhone(request.getPhone());
        if (!accountRepository.existsByPhoneAndEnabledAndDropped(phone, true, false)) {
            return PatientFindLoginIdResponse.builder()
                    .found(false)
                    .message("일치하는 회원 정보를 찾을 수 없습니다.")
                    .build();
        }

        Optional<String> loginId = accountRepository.findLoginIdByNameAndPhone(name, phone);
        if (loginId.isEmpty()) {
            return PatientFindLoginIdResponse.builder()
                    .found(false)
                    .message("일치하는 회원 정보를 찾을 수 없습니다.")
                    .build();
        }

        return PatientFindLoginIdResponse.builder()
                .found(true)
                .loginId(loginId.get())
                .message("아이디를 찾았습니다.")
                .build();
    }

    @Override
    @Transactional
    public PatientFindPasswordResponse sendTemporaryPassword(PatientFindPasswordRequest request) {
        checkArgument(isNotBlank(request.getName()), "이름은 필수입니다.");
        checkArgument(isNotBlank(request.getPhone()), "전화번호는 필수입니다.");
        checkArgument(isNotBlank(request.getEmail()), "이메일은 필수입니다.");
        validateEmailFormat(request.getEmail());
        validatePhoneFormat(request.getPhone());

        String name = request.getName().trim();
        String phone = normalizePhone(request.getPhone());
        AccountRecoveryInfo account = accountRepository.findRecoveryInfoListByNameAndPhone(name, phone)
                .stream()
                .findFirst()
                .orElseThrow(() -> new AccountNotFoundException("일치하는 회원 정보를 찾을 수 없습니다."));

        if (isBlank(account.getEmail())
                || !account.getEmail().trim().equalsIgnoreCase(request.getEmail().trim())) {
            throw new AccountNotFoundException("입력하신 이메일과 등록된 이메일이 일치하지 않습니다.");
        }

        if (!account.getSignType().equals(SignType.GENERAL) && !account.getSignType().equals(SignType.DEFAULT)) {
            throw new AccountNotFoundException("비밀번호 재설정을 지원하지 않는 계정입니다.");
        }

        String temporaryPassword = jhUtil.generateRandomString(10);
        accountRepository.updatePasswordBySeq(account.getSeq(), passwordEncoder.encode(temporaryPassword));

        sendTemporaryPasswordEmail(account.getEmail(), account.getName(), temporaryPassword);

        return PatientFindPasswordResponse.builder()
                .sent(true)
                .message("등록된 이메일로 임시 비밀번호를 발송했습니다.")
                .build();
    }

    @Override
    @Transactional
    public PatientResetPasswordResponse resetPassword(PatientResetPasswordRequest request) {
        checkArgument(isNotBlank(request.getLoginId()), "아이디는 필수입니다.");
        checkArgument(isNotBlank(request.getName()), "이름은 필수입니다.");
        checkArgument(isNotBlank(request.getPhone()), "전화번호는 필수입니다.");
        validateLoginIdFormat(request.getLoginId());
        validatePhoneFormat(request.getPhone());

        String loginId = request.getLoginId().trim();
        String name = request.getName().trim();
        String phone = normalizePhone(request.getPhone());

        AccountRecoveryInfo account = accountRepository.findRecoveryInfoListByLoginIdNameAndPhone(loginId, name, phone)
                .stream()
                .findFirst()
                .orElseThrow(() -> new AccountNotFoundException("일치하는 회원 정보를 찾을 수 없습니다."));

        if (!account.getSignType().equals(SignType.GENERAL) && !account.getSignType().equals(SignType.DEFAULT)) {
            throw new AccountNotFoundException("비밀번호 초기화를 지원하지 않는 계정입니다.");
        }

        String temporaryPassword = generateCompliantTemporaryPassword();
        String encodedPassword = passwordEncoder.encode(temporaryPassword);
        accountRepository.updatePasswordBySeq(account.getSeq(), encodedPassword);

        Account entity = accountRepository.findById(account.getSeq())
                .orElseThrow(() -> new AccountNotFoundException("일치하는 회원 정보를 찾을 수 없습니다."));
        entity.setPasswordMustChange(true);
        accountRepository.save(entity);
        biometricAccountService.revokeAllDevices(account.getSeq());
        entity.setBiometricLoginEnabled(false);
        accountRepository.save(entity);

        Optional<String> storedHash = accountRepository.findPasswordHashByLoginId(loginId);
        if (storedHash.isEmpty() || !passwordEncoder.matches(temporaryPassword, storedHash.get())) {
            throw new IllegalStateException("임시 비밀번호 저장 검증에 실패했습니다.");
        }

        // 이메일이 없어도 초기화는 항상 성공. 메일이 있으면 발송 시도하되 실패해도 응답에 임시 비밀번호는 유지.
        boolean emailSent = trySendTemporaryPasswordEmail(account, temporaryPassword);
        String message = emailSent
                ? "비밀번호가 초기화되었습니다. 임시 비밀번호로 로그인 후 변경해 주세요. 등록된 이메일로 임시 비밀번호 발송을 완료했습니다."
                : "비밀번호가 초기화되었습니다. 임시 비밀번호로 로그인 후 변경해 주세요.";

        return PatientResetPasswordResponse.builder()
                .reset(true)
                .temporaryPassword(temporaryPassword)
                .emailSent(emailSent)
                .message(message)
                .build();
    }

    private boolean trySendTemporaryPasswordEmail(AccountRecoveryInfo account, String temporaryPassword) {
        if (isBlank(account.getEmail())) {
            return false;
        }
        String email = account.getEmail().trim();
        if (!jhUtil.checkEmail(email)) {
            log.warn("Skip temporary password email: invalid email for accountSeq={}", account.getSeq());
            return false;
        }
        try {
            sendTemporaryPasswordEmail(email, account.getName(), temporaryPassword);
            return true;
        } catch (Exception e) {
            // 초기화 자체는 성공한 상태이므로 메일 실패로 API를 실패 처리하지 않는다.
            log.warn("Failed to send temporary password email for accountSeq={}", account.getSeq(), e);
            return false;
        }
    }

    private void sendTemporaryPasswordEmail(String email, String name, String temporaryPassword) {
        emailService.sendPlainText(
                email,
                "[CAMA] 임시 비밀번호 안내",
                "안녕하세요, " + name + "님.\n\n"
                        + "요청하신 임시 비밀번호는 아래와 같습니다.\n"
                        + temporaryPassword + "\n\n"
                        + "로그인 후 비밀번호를 변경해 주세요.");
    }

    private String generateCompliantTemporaryPassword() {
        return "Cama" + jhUtil.numberGenerator(4, 1) + "!";
    }

    @Override
    @Transactional
    public PatientProfileUpdateResponse updateProfile(PatientProfileUpdateRequest request) {
        checkArgument(isNotBlank(request.getLoginId()), "아이디는 필수입니다.");
        checkArgument(isNotBlank(request.getName()), "이름은 필수입니다.");
        checkArgument(isNotBlank(request.getPhone()), "전화번호는 필수입니다.");
        validateLoginIdFormat(request.getLoginId());
        validatePhoneFormat(request.getPhone());

        String loginId = request.getLoginId().trim();
        String name = request.getName().trim();
        String phone = normalizePhone(request.getPhone());
        String email = blankToNull(request.getEmail());
        String birth = blankToNull(request.getBirth());

        if (email != null) {
            validateEmailFormat(email);
        }
        if (birth != null) {
            checkArgument(jhUtil.isoDateFormatterChecker(birth), "생년월일 형식이 올바르지 않습니다.");
        }

        Gender gender = null;
        if (isNotBlank(request.getGender())) {
            gender = Gender.getStatusKey(request.getGender().trim());
            checkArgument(gender != null, "성별 형식이 올바르지 않습니다.");
        }

        Account account = accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false)
                .orElseThrow(() -> new AccountNotFoundException("일치하는 회원 정보를 찾을 수 없습니다."));

        if (email != null) {
            accountRepository.findByEmailAndEnabledAndDropped(email, true, false)
                    .ifPresent(existing -> {
                        if (!existing.getSeq().equals(account.getSeq())) {
                            throw new AlreadyAccountDuplicateException(email);
                        }
                    });
        }

        accountRepository.findByPhoneAndEnabledAndDropped(phone, true, false)
                .ifPresent(existing -> {
                    if (!existing.getSeq().equals(account.getSeq())) {
                        throw new AlreadyAccountDuplicateException(phone);
                    }
                });

        account.setName(name);
        account.setPhone(phone);
        account.setEmail(email);
        account.setBirth(birth);
        if (gender != null) {
            account.setGender(gender);
        }

        accountRepository.saveAndFlush(account);

        return PatientProfileUpdateResponse.builder()
                .updated(true)
                .message("개인정보가 수정되었습니다.")
                .build();
    }

    @Override
    @Transactional
    public PatientChangePasswordResponse changePassword(PatientChangePasswordRequest request) {
        checkArgument(isNotBlank(request.getLoginId()), "아이디는 필수입니다.");
        checkArgument(isNotBlank(request.getCurrentPassword()), "현재 비밀번호는 필수입니다.");
        checkArgument(isNotBlank(request.getNewPassword()), "새 비밀번호는 필수입니다.");
        checkArgument(isNotBlank(request.getNewPasswordConfirm()), "새 비밀번호 확인은 필수입니다.");
        validateLoginIdFormat(request.getLoginId());
        validatePasswordFormat(request.getNewPassword());
        checkArgument(request.getNewPassword().equals(request.getNewPasswordConfirm()),
                "새 비밀번호가 일치하지 않습니다.");
        checkArgument(!request.getCurrentPassword().equals(request.getNewPassword()),
                "새 비밀번호는 현재 비밀번호와 달라야 합니다.");

        String loginId = request.getLoginId().trim();
        Account account = accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false)
                .orElseThrow(() -> new AccountNotFoundException("일치하는 회원 정보를 찾을 수 없습니다."));

        if (!account.getSignType().equals(SignType.GENERAL) && !account.getSignType().equals(SignType.DEFAULT)) {
            throw new AccountNotFoundException("비밀번호 변경을 지원하지 않는 계정입니다.");
        }

        Optional<String> storedHash = accountRepository.findPasswordHashByLoginId(loginId);
        if (storedHash.isEmpty() || !passwordEncoder.matches(request.getCurrentPassword(), storedHash.get())) {
            throw new IllegalArgumentException("현재 비밀번호가 일치하지 않습니다.");
        }

        accountRepository.updatePasswordBySeq(account.getSeq(), passwordEncoder.encode(request.getNewPassword()));

        account.setPasswordMustChange(false);
        account.setBiometricLoginEnabled(false);
        accountRepository.save(account);
        biometricAccountService.revokeAllDevices(account.getSeq());

        boolean emailSent = trySendPasswordChangedEmail(account);
        String message = emailSent
                ? "비밀번호가 변경되었습니다. 등록된 이메일로 변경 안내 메일을 발송했습니다."
                : "비밀번호가 변경되었습니다.";

        return PatientChangePasswordResponse.builder()
                .changed(true)
                .emailSent(emailSent)
                .message(message)
                .build();
    }

    private boolean trySendPasswordChangedEmail(Account account) {
        if (isBlank(account.getEmail())) {
            return false;
        }
        String email = account.getEmail().trim();
        if (!jhUtil.checkEmail(email)) {
            log.warn("Skip password-changed email: invalid email for accountSeq={}", account.getSeq());
            return false;
        }
        try {
            String name = isBlank(account.getName()) ? "회원" : account.getName().trim();
            emailService.sendPlainText(
                    email,
                    "[CAMA] 비밀번호 변경 안내",
                    "안녕하세요, " + name + "님.\n\n"
                            + "회원님의 계정 비밀번호가 변경되었습니다.\n"
                            + "본인이 변경한 것이 아니라면 즉시 고객센터로 문의해 주세요.\n\n"
                            + "보안을 위해 새 비밀번호는 메일에 포함하지 않습니다.");
            return true;
        } catch (Exception e) {
            log.warn("Failed to send password-changed email for accountSeq={}", account.getSeq(), e);
            return false;
        }
    }

    private void validateRegisterRequest(PatientRegisterRequest request) {
        checkArgument(isNotBlank(request.getLoginId()), "로그인 ID는 필수입니다.");
        checkArgument(isNotBlank(request.getPassword()), "비밀번호는 필수입니다.");
        checkArgument(isNotBlank(request.getPasswordConfirm()), "비밀번호 확인은 필수입니다.");
        checkArgument(request.getPassword().equals(request.getPasswordConfirm()), "비밀번호가 일치하지 않습니다.");
        checkArgument(isNotBlank(request.getName()), "이름은 필수입니다.");
        checkArgument(isNotBlank(request.getPhone()), "전화번호는 필수입니다.");

        validateLoginIdFormat(request.getLoginId());
        if (isNotBlank(request.getEmail())) {
            validateEmailFormat(request.getEmail());
        }
        validatePhoneFormat(request.getPhone());
        validatePasswordFormat(request.getPassword());

        if (isNotBlank(request.getBirthday())) {
            checkArgument(jhUtil.isoDateFormatterChecker(request.getBirthday()), "생년월일 형식이 올바르지 않습니다.");
        }
    }

    private void validateLoginIdFormat(String loginId) {
        checkArgument(isNotBlank(loginId), "로그인 ID는 필수입니다.");
        checkArgument(jhUtil.isCheckId(loginId.trim()), "ID는 영문/숫자 4~20자만 사용할 수 있습니다.");
    }

    private void validateEmailFormat(String email) {
        checkArgument(isNotBlank(email), "이메일은 필수입니다.");
        checkArgument(jhUtil.checkEmail(email.trim()), "이메일 형식이 올바르지 않습니다.");
    }

    private void validatePhoneFormat(String phone) {
        checkArgument(isNotBlank(phone), "전화번호는 필수입니다.");
        String normalized = normalizePhone(phone);
        checkArgument(normalized.length() >= 10 && normalized.length() <= 11, "전화번호 형식이 올바르지 않습니다.");
    }

    private void validatePasswordFormat(String password) {
        checkArgument(password.length() >= 8 && password.length() <= 20, "비밀번호는 8~20자여야 합니다.");
        checkArgument(jhUtil.checkPassword(password),
                "비밀번호는 영문, 숫자, 특수문자(~!@#$%^&*()+|=)를 각 1개 이상 포함해야 합니다.");
    }

    private String normalizePhone(String phone) {
        return phone == null ? "" : phone.replaceAll("[^0-9]", "");
    }

    private String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}

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

    private final AccountRepository accountRepository;
    private final FirebaseTokenRepository firebaseTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JhUtil jhUtil;
    private final EmailService emailService;
    private final AccountService accountService;

    public PatientAccountServiceImpl(
            AccountRepository accountRepository,
            FirebaseTokenRepository firebaseTokenRepository,
            PasswordEncoder passwordEncoder,
            JhUtil jhUtil,
            EmailService emailService,
            AccountService accountService) {
        this.accountRepository = accountRepository;
        this.firebaseTokenRepository = firebaseTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jhUtil = jhUtil;
        this.emailService = emailService;
        this.accountService = accountService;
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

        emailService.sendPlainText(
                account.getEmail(),
                "[CAMA] 임시 비밀번호 안내",
                "안녕하세요, " + account.getName() + "님.\n\n"
                        + "요청하신 임시 비밀번호는 아래와 같습니다.\n"
                        + temporaryPassword + "\n\n"
                        + "로그인 후 비밀번호를 변경해 주세요.");

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

        Optional<String> storedHash = accountRepository.findPasswordHashByLoginId(loginId);
        if (storedHash.isEmpty() || !passwordEncoder.matches(temporaryPassword, storedHash.get())) {
            throw new IllegalStateException("임시 비밀번호 저장 검증에 실패했습니다.");
        }

        return PatientResetPasswordResponse.builder()
                .reset(true)
                .temporaryPassword(temporaryPassword)
                .message("비밀번호가 초기화되었습니다. 임시 비밀번호로 로그인 후 변경해 주세요.")
                .build();
    }

    private String generateCompliantTemporaryPassword() {
        return "Cama" + jhUtil.numberGenerator(4, 1) + "!";
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

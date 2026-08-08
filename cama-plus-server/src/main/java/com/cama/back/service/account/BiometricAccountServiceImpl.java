package com.cama.back.service.account;

import com.cama.back.domain.account.Account;
import com.cama.back.domain.account.AccountBiometricDevice;
import com.cama.back.domain.account.AccountRole;
import com.cama.back.dto.account.*;
import com.cama.back.exception.account.AccountNotFoundException;
import com.cama.back.repo.account.AccountBiometricDeviceRepository;
import com.cama.back.repo.account.AccountRepository;
import com.cama.back.security.JWT;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;
import java.util.Set;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@Service
public class BiometricAccountServiceImpl implements BiometricAccountService {

    private static final int MAX_FAIL_COUNT = 5;
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final AccountRepository accountRepository;
    private final AccountBiometricDeviceRepository deviceRepository;
    private final AccountService accountService;
    private final JWT jwt;

    public BiometricAccountServiceImpl(
            AccountRepository accountRepository,
            AccountBiometricDeviceRepository deviceRepository,
            AccountService accountService,
            JWT jwt) {
        this.accountRepository = accountRepository;
        this.deviceRepository = deviceRepository;
        this.accountService = accountService;
        this.jwt = jwt;
    }

    @Override
    @Transactional(readOnly = true)
    public BiometricStatusResponse status(BiometricStatusRequest request) {
        checkArgument(isNotBlank(request.getLoginId()), "아이디는 필수입니다.");
        checkArgument(isNotBlank(request.getDeviceId()), "기기 식별자는 필수입니다.");

        Account account = requireAccount(request.getLoginId().trim());
        boolean deviceRegistered = deviceRepository
                .findByAccountSeqAndDeviceId(account.getSeq(), request.getDeviceId().trim())
                .filter(d -> d.isEnabled() && d.getRevokedAt() == null)
                .isPresent();

        return BiometricStatusResponse.builder()
                .passwordMustChange(account.isPasswordMustChange())
                .deviceRegistered(deviceRegistered)
                .biometricPromptDeclined(account.isBiometricPromptDeclined())
                .biometricLoginEnabled(account.isBiometricLoginEnabled())
                .build();
    }

    @Override
    @Transactional
    public BiometricEnrollResponse enroll(BiometricEnrollRequest request) {
        checkArgument(isNotBlank(request.getLoginId()), "아이디는 필수입니다.");
        checkArgument(isNotBlank(request.getDeviceId()), "기기 식별자는 필수입니다.");

        Account account = requireAccount(request.getLoginId().trim());
        if (account.isPasswordMustChange()) {
            throw new IllegalArgumentException("비밀번호를 먼저 변경한 후 생체 로그인을 등록해 주세요.");
        }

        String deviceId = request.getDeviceId().trim();
        var existingOpt = deviceRepository.findByAccountSeqAndDeviceId(account.getSeq(), deviceId);
        boolean isNewDevice = existingOpt.isEmpty()
                || !existingOpt.get().isEnabled()
                || existingOpt.get().getRevokedAt() != null;

        if (isNewDevice && account.getBiometricDeviceLimit() != null) {
            long enabledCount = deviceRepository.countByAccountSeqAndEnabledTrueAndRevokedAtIsNull(account.getSeq());
            checkArgument(
                    enabledCount < account.getBiometricDeviceLimit(),
                    "등록 가능한 생체 로그인 기기 수를 초과했습니다.");
        }

        String refreshToken = generateRefreshToken();
        String hash = sha256Hex(refreshToken);
        LocalDateTime now = LocalDateTime.now();

        AccountBiometricDevice device = existingOpt.orElseGet(() -> AccountBiometricDevice.builder()
                .accountSeq(account.getSeq())
                .deviceId(deviceId)
                .createdAt(now)
                .build());
        device.setPlatform(blankToNull(request.getPlatform()));
        device.setDeviceName(blankToNull(request.getDeviceName()));
        device.setRefreshTokenHash(hash);
        device.setEnabled(true);
        device.setFailCount(0);
        device.setRevokedAt(null);
        device.setLastUsedAt(null);
        deviceRepository.save(device);

        account.setBiometricLoginEnabled(true);
        account.setBiometricPromptDeclined(false);
        account.setBiometricPromptAnsweredAt(now);
        accountRepository.save(account);

        return BiometricEnrollResponse.builder()
                .deviceRefreshToken(refreshToken)
                .message("생체 로그인이 등록되었습니다. 다음부터 얼굴/지문으로 로그인할 수 있습니다.")
                .build();
    }

    @Override
    @Transactional
    public BiometricLoginResponse login(BiometricLoginRequest request) {
        checkArgument(isNotBlank(request.getDeviceId()), "기기 식별자는 필수입니다.");
        checkArgument(isNotBlank(request.getRefreshToken()), "생체 로그인 토큰이 없습니다.");

        String deviceId = request.getDeviceId().trim();
        String expectedHash = sha256Hex(request.getRefreshToken().trim());

        Optional<AccountBiometricDevice> matched = deviceRepository
                .findByDeviceIdAndRefreshTokenHashAndEnabledTrueAndRevokedAtIsNull(deviceId, expectedHash);

        if (matched.isEmpty()) {
            deviceRepository.findByDeviceIdAndEnabledTrueAndRevokedAtIsNull(deviceId).ifPresent(device -> {
                device.setFailCount(device.getFailCount() + 1);
                if (device.getFailCount() >= MAX_FAIL_COUNT) {
                    device.setEnabled(false);
                    device.setRevokedAt(LocalDateTime.now());
                }
                deviceRepository.save(device);
            });
            throw new IllegalArgumentException("생체 로그인에 실패했습니다. 아이디/비밀번호로 로그인해 주세요.");
        }

        AccountBiometricDevice device = matched.get();

        Account account = accountRepository.findById(device.getAccountSeq())
                .filter(a -> a.isEnabled() && !a.isDropped())
                .orElseThrow(() -> new AccountNotFoundException("일치하는 회원 정보를 찾을 수 없습니다."));

        device.setFailCount(0);
        device.setLastUsedAt(LocalDateTime.now());
        deviceRepository.save(device);

        if (request.getFirebase() != null) {
            boolean isAdmin = account.getRoles() != null
                    && account.getRoles().stream().anyMatch(r -> r.equals(AccountRole.ADMIN));
            if (!isAdmin) {
                accountService.firebaseToken(account, request.getFirebase());
            }
        }

        Set<AccountRole> roles = account.getRoles();
        if (roles == null || roles.isEmpty()) {
            roles = Set.of(AccountRole.USER);
        }
        String apiToken = account.newApiToken(
                jwt, roles.stream().map(AccountRole::name).toArray(String[]::new));

        return BiometricLoginResponse.builder()
                .apiToken(apiToken)
                .account(account)
                .build();
    }

    @Override
    @Transactional
    public BiometricSimpleResponse decline(BiometricDeclineRequest request) {
        checkArgument(isNotBlank(request.getLoginId()), "아이디는 필수입니다.");
        Account account = requireAccount(request.getLoginId().trim());
        account.setBiometricPromptDeclined(true);
        account.setBiometricPromptAnsweredAt(LocalDateTime.now());
        accountRepository.save(account);
        return BiometricSimpleResponse.builder()
                .ok(true)
                .message("생체 로그인 안내를 나중에 표시합니다.")
                .build();
    }

    @Override
    @Transactional
    public BiometricSimpleResponse disable(BiometricDisableRequest request) {
        checkArgument(isNotBlank(request.getLoginId()), "아이디는 필수입니다.");
        Account account = requireAccount(request.getLoginId().trim());
        LocalDateTime now = LocalDateTime.now();

        if (request.isDisableAll() || isBlank(request.getDeviceId())) {
            revokeAllDevices(account.getSeq());
            account.setBiometricLoginEnabled(false);
            accountRepository.save(account);
            return BiometricSimpleResponse.builder()
                    .ok(true)
                    .message("생체 로그인이 해제되었습니다.")
                    .build();
        }

        deviceRepository.findByAccountSeqAndDeviceId(account.getSeq(), request.getDeviceId().trim())
                .ifPresent(device -> {
                    device.setEnabled(false);
                    device.setRevokedAt(now);
                    deviceRepository.save(device);
                });

        if (deviceRepository.countByAccountSeqAndEnabledTrueAndRevokedAtIsNull(account.getSeq()) == 0) {
            account.setBiometricLoginEnabled(false);
            accountRepository.save(account);
        }

        return BiometricSimpleResponse.builder()
                .ok(true)
                .message("이 기기의 생체 로그인이 해제되었습니다.")
                .build();
    }

    @Override
    @Transactional
    public void revokeAllDevices(Long accountSeq) {
        deviceRepository.revokeAllByAccountSeq(accountSeq, LocalDateTime.now());
    }

    private Account requireAccount(String loginId) {
        return accountRepository.findByLoginIdAndEnabledAndDropped(loginId, true, false)
                .orElseThrow(() -> new AccountNotFoundException("일치하는 회원 정보를 찾을 수 없습니다."));
    }

    private static String generateRefreshToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    private static String sha256Hex(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hashed);
        } catch (Exception e) {
            throw new IllegalStateException("토큰 해시 생성에 실패했습니다.", e);
        }
    }

    private static String blankToNull(String value) {
        return isBlank(value) ? null : value.trim();
    }
}

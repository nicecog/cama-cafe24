package com.cama.back.service.monitor;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isBlank;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.cama.back.domain.account.SignType;
import com.cama.back.dto.monitor.MonitorPatientAccountDetailRsp;
import com.cama.back.dto.monitor.MonitorPatientEmailUpdateRequest;
import com.cama.back.dto.monitor.MonitorPatientPasswordUpdateRequest;
import com.cama.back.dto.monitor.MonitorPatientPasswordUpdateResponse;
import com.cama.back.exception.account.AccountNotFoundException;
import com.cama.back.mapper.MonitorMapper;
import com.cama.back.repo.account.AccountRepository;
import com.cama.back.util.JhUtil;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MonitorPatientAccountServiceImpl implements MonitorPatientAccountService {

    private final MonitorMapper monitorMapper;
    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JhUtil jhUtil;

    @Override
    public MonitorPatientAccountDetailRsp getAccountDetail(Long doctorSeq, Long acSeq) {
        checkArgument(doctorSeq != null && acSeq != null, "환자 정보가 올바르지 않습니다.");
        return monitorMapper.getMonitorPatientAccountDetail(acSeq, doctorSeq)
                .orElseThrow(AccountNotFoundException::new);
    }

    @Override
    @Transactional
    public boolean updateEmail(Long doctorSeq, MonitorPatientEmailUpdateRequest request) {
        checkArgument(request != null && request.getAcSeq() != null, "환자 정보가 올바르지 않습니다.");
        validateEmailFormat(request.getEmail());

        MonitorPatientAccountDetailRsp account = getAccountDetail(doctorSeq, request.getAcSeq());
        String email = request.getEmail().trim();

        if (email.equalsIgnoreCase(Optional.ofNullable(account.getEmail()).orElse("").trim())) {
            return true;
        }

        accountRepository.findByEmailAndEnabledAndDropped(email, true, false)
                .ifPresent(existing -> {
                    if (!existing.getSeq().equals(account.getSeq())) {
                        throw new IllegalArgumentException("이미 사용 중인 이메일입니다.");
                    }
                });

        int updated = monitorMapper.updatePatientEmail(account.getSeq(), email);
        return updated > 0;
    }

    @Override
    @Transactional
    public MonitorPatientPasswordUpdateResponse updatePassword(Long doctorSeq, MonitorPatientPasswordUpdateRequest request) {
        checkArgument(request != null && request.getAcSeq() != null, "환자 정보가 올바르지 않습니다.");

        MonitorPatientAccountDetailRsp account = getAccountDetail(doctorSeq, request.getAcSeq());
        if (!account.isPasswordResetSupported()) {
            throw new IllegalArgumentException("소셜 로그인 계정은 비밀번호를 변경할 수 없습니다.");
        }

        String mode = isNotBlank(request.getMode())
                ? request.getMode().trim().toUpperCase()
                : MonitorPatientPasswordUpdateRequest.MODE_MANUAL;

        String plainPassword;
        if (MonitorPatientPasswordUpdateRequest.MODE_RANDOM.equals(mode)) {
            plainPassword = generateCompliantTemporaryPassword();
        } else {
            checkArgument(isNotBlank(request.getPassword()), "비밀번호는 필수입니다.");
            checkArgument(isNotBlank(request.getPasswordConfirm()), "비밀번호 확인은 필수입니다.");
            checkArgument(request.getPassword().equals(request.getPasswordConfirm()), "비밀번호가 일치하지 않습니다.");
            validatePasswordFormat(request.getPassword());
            plainPassword = request.getPassword();
        }

        accountRepository.updatePasswordBySeq(account.getSeq(), passwordEncoder.encode(plainPassword));

        return MonitorPatientPasswordUpdateResponse.builder()
                .updated(true)
                .generatedPassword(
                        MonitorPatientPasswordUpdateRequest.MODE_RANDOM.equals(mode) ? plainPassword : null)
                .message(MonitorPatientPasswordUpdateRequest.MODE_RANDOM.equals(mode)
                        ? "임시 비밀번호가 생성되었습니다. 환자에게 안내해 주세요."
                        : "비밀번호가 변경되었습니다.")
                .build();
    }

    private String generateCompliantTemporaryPassword() {
        return "Cama" + jhUtil.numberGenerator(4, 1) + "!";
    }

    private void validateEmailFormat(String email) {
        checkArgument(isNotBlank(email), "이메일은 필수입니다.");
        checkArgument(jhUtil.checkEmail(email.trim()), "이메일 형식이 올바르지 않습니다.");
    }

    private void validatePasswordFormat(String password) {
        checkArgument(password.length() >= 8 && password.length() <= 20, "비밀번호는 8~20자여야 합니다.");
        checkArgument(jhUtil.checkPassword(password),
                "비밀번호는 영문, 숫자, 특수문자(~!@#$%^&*()+|=)를 각 1개 이상 포함해야 합니다.");
    }
}

package com.cama.back.service.account;

import com.cama.back.dto.account.*;

public interface BiometricAccountService {
    BiometricStatusResponse status(BiometricStatusRequest request);

    BiometricEnrollResponse enroll(BiometricEnrollRequest request);

    BiometricLoginResponse login(BiometricLoginRequest request);

    BiometricSimpleResponse decline(BiometricDeclineRequest request);

    BiometricSimpleResponse disable(BiometricDisableRequest request);

    void revokeAllDevices(Long accountSeq);
}

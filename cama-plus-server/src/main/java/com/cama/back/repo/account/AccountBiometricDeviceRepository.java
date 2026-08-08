package com.cama.back.repo.account;

import com.cama.back.domain.account.AccountBiometricDevice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface AccountBiometricDeviceRepository extends JpaRepository<AccountBiometricDevice, Long> {

    Optional<AccountBiometricDevice> findByAccountSeqAndDeviceId(Long accountSeq, String deviceId);

    Optional<AccountBiometricDevice> findByDeviceIdAndEnabledTrueAndRevokedAtIsNull(String deviceId);

    Optional<AccountBiometricDevice> findByDeviceIdAndRefreshTokenHashAndEnabledTrueAndRevokedAtIsNull(
            String deviceId, String refreshTokenHash);

    List<AccountBiometricDevice> findByAccountSeqAndEnabledTrueAndRevokedAtIsNull(Long accountSeq);

    long countByAccountSeqAndEnabledTrueAndRevokedAtIsNull(Long accountSeq);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
            UPDATE AccountBiometricDevice d
            SET d.enabled = false, d.revokedAt = :revokedAt
            WHERE d.accountSeq = :accountSeq AND d.enabled = true
            """)
    int revokeAllByAccountSeq(@Param("accountSeq") Long accountSeq, @Param("revokedAt") LocalDateTime revokedAt);
}

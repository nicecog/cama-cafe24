package com.cama.back.domain.account;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(
        name = "account_biometric_device",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_account_biometric_device",
                columnNames = {"account_seq", "device_id"}
        )
)
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "id")
public class AccountBiometricDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "account_seq", nullable = false)
    private Long accountSeq;

    @Column(name = "device_id", nullable = false, length = 128)
    private String deviceId;

    @Column(length = 32)
    private String platform;

    @Column(name = "device_name", length = 128)
    private String deviceName;

    @Column(name = "refresh_token_hash", nullable = false, length = 128)
    private String refreshTokenHash;

    @Column(nullable = false)
    @Builder.Default
    private boolean enabled = true;

    @Column(name = "fail_count", nullable = false)
    @Builder.Default
    private int failCount = 0;

    @Column(name = "last_used_at")
    private LocalDateTime lastUsedAt;

    @Column(name = "created_at", nullable = false)
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "revoked_at")
    private LocalDateTime revokedAt;
}

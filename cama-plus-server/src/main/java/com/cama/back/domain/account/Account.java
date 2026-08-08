package com.cama.back.domain.account;

import com.cama.back.exception.common.PasswordNotMatchingException;
import com.cama.back.security.JWT;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "seq")
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    private String loginId;

    private String email;

    private String nickName;

    private String name;

    private String phone;

    private String birth;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private SignType signType;

    private String profileImage;

    private String impUid;

    @JsonIgnore
    private String password;


    @ElementCollection(fetch = FetchType.EAGER)
    @Enumerated(EnumType.STRING)
    private Set<AccountRole> roles;

    @JsonIgnore
    @Column(name = "is_enabled")
    private boolean enabled;

    @JsonIgnore
    @Column(name = "is_dropped")
    private boolean dropped;

    private String droppedOutDate;

    private String dropReason;
    
    private String userTypeCd;
    
    private String lang;

    @Column(name = "patient_management_number")
    private String patientManagementNumber;

    @Column(name = "password_must_change", nullable = false)
    @Builder.Default
    private boolean passwordMustChange = false;

    @Column(name = "biometric_login_enabled", nullable = false)
    @Builder.Default
    private boolean biometricLoginEnabled = false;

    @Column(name = "biometric_prompt_declined", nullable = false)
    @Builder.Default
    private boolean biometricPromptDeclined = false;

    @Column(name = "biometric_prompt_answered_at")
    private LocalDateTime biometricPromptAnsweredAt;

    @Column(name = "biometric_device_limit")
    private Integer biometricDeviceLimit;

    @Column(updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;

    @Column(updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updatedAt;

    public String newApiToken(JWT jwt, String[] roles) {
        String displayName = (nickName != null && !nickName.isBlank()) ? nickName : name;
        JWT.Claims claims = JWT.Claims.of(seq, loginId, displayName != null ? displayName : "", roles);
        return jwt.newToken(claims);
    }

    public void login(PasswordEncoder passwordEncoder, String credentials) {
        if (!passwordEncoder.matches(credentials, password)) {
            throw new PasswordNotMatchingException();
        }
    }


    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

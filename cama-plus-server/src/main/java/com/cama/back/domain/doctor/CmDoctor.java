package com.cama.back.domain.doctor;

import com.cama.back.exception.common.PasswordNotMatchingException;
import com.cama.back.security.JWT;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "seq")
public class CmDoctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    private String loginId;

    @JsonIgnore
    private String password;

    private String name;

    private String nick;

    private String phone;

    private Long hospitalSeq;

    private Long departmentSeq;

    private String profileImage;

    private String profileLink;

    private String lastedAt;

    @JsonIgnore
    @Column(name = "is_enabled")
    private boolean enabled;

    @Column(updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;

    @Column(updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updatedAt;

    public String apiToken(JWT jwt, String[] roles) {
        JWT.Claims claims = JWT.Claims.of(seq, loginId, name, roles);
        return jwt.newToken(claims);
    }

    public void login(PasswordEncoder passwordEncoder, String credentials) {
        if (!passwordEncoder.matches(credentials, password)) {
            throw new PasswordNotMatchingException();
        }
    }

}

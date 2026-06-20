package com.cama.back.dto.monitor;

import com.cama.back.domain.account.Gender;
import com.cama.back.domain.account.SignType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonitorPatientAccountDetailRsp {

    private Long seq;
    private String loginId;
    private String email;
    private String name;
    private String phone;
    private String birth;
    private Gender gender;
    private SignType signType;
    private String signTypeNm;
    private String userTypeCd;
    private String userTypeNm;
    private String createdAt;
    private String updatedAt;
    /** GENERAL/DEFAULT 계정만 관리자 비밀번호 변경 가능 */
    private boolean passwordResetSupported;
}

package com.cama.back.dto.monitor;

import com.cama.back.domain.account.Gender;
import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonitorPatientRsp {

    private Long seq;

    private String name;
    
    private String loginId;

    private String birth;

    private Gender gender;

    private String disease;
    
    private String userTypeCd;
    
    private String userTypeNm;

    private double progress;

    private String createdAt;
    
    private String lang;

    /** FCM 푸시 가능 여부 (firebase_token) */
    private Boolean hasFcmToken;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

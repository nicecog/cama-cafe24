package com.cama.back.dto.admin;

import com.cama.back.domain.account.Gender;
import com.cama.back.domain.account.SignType;
import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminAccountRsp {

    private Long seq;

    private String email;

    private String nickName;

    private String name;

    private String phone;

    private String birth;

    private Gender gender;

    private SignType signType;

    private boolean dropped;

    private String dropReason;

    private String droppedOutDate;

    private String createdAt;

    private Long registerCount;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

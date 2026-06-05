package com.cama.back.dto.account;

import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountMeRsp {

    private Long seq;

    private String loginId;

    private String snsType;

    private String name;

    private String phone;

    private boolean enabled;

    private boolean removed;

    private String createdAt;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

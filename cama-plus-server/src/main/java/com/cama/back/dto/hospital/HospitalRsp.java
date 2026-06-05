package com.cama.back.dto.hospital;

import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalRsp {

    private Long seq;

    private String name;

    private String corpNumber;

    private String address;

    private String homepage;

    private String profName;

    private String profMajor;

    private String profEmail;

    private String profPhone;

    private String createdAt;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

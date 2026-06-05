package com.cama.back.dto.doctor;

import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorRsp {

    private Long seq;

    private String loginId;

    private String name;

    private String nick;

    private String phone;

    private String profileImage;

    private String profileLink;

    private Long hospitalSeq;

    private String hospitalName;

    private Long departmentSeq;

    private String departmentName;

    private String createdAt;

    private Long contentsCount = 0L;

    private String lastedAt;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

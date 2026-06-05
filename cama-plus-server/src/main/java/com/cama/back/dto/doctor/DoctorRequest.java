package com.cama.back.dto.doctor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DoctorRequest {

    private String loginId;

    private String name;

    private String nick;

    private Long hospitalSeq; // 소속

    private Long departmentSeq; // 전공

    private String password;

    private String profileImage;

    private String profileLink;

    private String phone;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

package com.cama.back.dto.hospital;

import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HospitalDoctorRsp {

    private Long doctorSeq;

    private String doctorName;

    private Long hospitalSeq;

    private String hospitalName;

    private Long departmentSeq;

    private String departmentName;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

package com.cama.back.dto.doctor;

import com.cama.back.domain.hospital.ServiceStatus;
import com.cama.back.dto.disease.DiseaseRsp;
import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRsp {

    private Long serviceSeq;

    private String name;

    private Long accountSeq;

    private Long hospitalSeq;

    private String hospitalName;

    private String doctorName;

    private String departmentName;

    private ServiceStatus status;

    private String approveDate;

    private String rejectDate;

    private String createdAt;

    private List<DiseaseRsp> diseases;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

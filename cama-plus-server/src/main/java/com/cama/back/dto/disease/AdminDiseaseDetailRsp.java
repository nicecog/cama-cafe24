package com.cama.back.dto.disease;

import com.cama.back.domain.hospital.HpDiseaseOption;
import com.cama.back.domain.hospital.HpDiseaseTreatment;
import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDiseaseDetailRsp {

    private Long hospitalSeq;

    private String hospitalName;

    private Long diseaseSeq;

    private String diseaseName;

    private List<HpDiseaseOption> options;

    private List<HpDiseaseTreatment> treatments;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

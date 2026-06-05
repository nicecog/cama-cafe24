package com.cama.back.dto.hospital;

import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HpDiseaseRsp {

    private Long seq;

    private Long diseaseSeq;

    private String diseaseName;

    private List<HpDiseaseOptionRsp> diseaseOption;

    private List<HpTreatmentRsp> diseaseTreatment;


    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

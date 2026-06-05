package com.cama.back.dto.disease;

import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminDiseaseRsp {

    private Long seq;

    private Long hospitalSeq;

    private String hospitalName;

    private Long diseaseSeq;

    private String diseaseName;

    private Long contentsCount;

    private Long treatmentCount;

    private String updatedAt;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

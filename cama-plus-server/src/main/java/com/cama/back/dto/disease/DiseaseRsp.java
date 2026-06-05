package com.cama.back.dto.disease;

import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiseaseRsp {

    private Long diseaseSeq;

    private String diseaseName;

    private Long diseaseDetailSeq;

    private String diseaseDetailName;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

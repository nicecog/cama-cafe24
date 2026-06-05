package com.cama.back.dto.disease;

import com.cama.back.domain.disease.CmDiseaseDetail;
import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiseaseNameRsp {

    private Long diseaseSeq;

    private List<CmDiseaseDetail> diseaseDetails;

    private String diseaseName;

    private Long days;

    private Long trackSeq;

    private String trackCreatedAt;

    private Long progress;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

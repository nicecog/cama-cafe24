package com.cama.back.dto.disease;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.List;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HpDiseaseRequest {

    private Long hospitalSeq;

    private Long diseaseSeq;

    private List<AdminDiseaseOption> options;

    private List<AdminDiseaseTreatment> treatments;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

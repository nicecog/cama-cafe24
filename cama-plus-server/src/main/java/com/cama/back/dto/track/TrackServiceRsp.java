package com.cama.back.dto.track;

import lombok.*;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TrackServiceRsp {

    private Long seq;

    private Long diseaseSeq;

    private String diseaseName;

    private double process;

    private Long days;

    private String interest;

    private String data;

    private String disease;

//    private String diseaseStage;
//
//    private String treatment;

    private String trackCreatedAt;

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.JSON_STYLE);
    }

}

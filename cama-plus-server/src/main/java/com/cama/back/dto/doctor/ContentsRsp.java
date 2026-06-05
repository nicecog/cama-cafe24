package com.cama.back.dto.doctor;

import com.cama.back.domain.CareTimeType;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentsRsp {

    private Long seq;

    private Long doctorSeq;

    private Long trackServiceSeq;

    private Long diseaseSeq;

    private String diseaseName;

    private String doctorName;

    private String departmentName;

    private String title;

    private String image;

    private String contents;

    private Long viewCount;

    private boolean enabled;

    private boolean viewed;

    private boolean removed;

//    @JsonIgnore
//    private String careTimeType;
//
//    private List<CareTimeType> careTimeList;

    private String interest;

    private String createdAt;

    private String updatedAt;

    private String contentsUpdatedAt;

    //
    private Long progress;

    private String disease;
    
    private String favoriteYn;
    
    private Long priority;


    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

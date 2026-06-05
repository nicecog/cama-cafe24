package com.cama.back.dto.doctor;

import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContentsWebViewRsp {

    private String contents;

    private String interest;

    private String disease;

    private String title;

    private String doctorName;

    private String departmentName;

    private String createdAt;

    //private List<CareTimeType> careTimeList;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

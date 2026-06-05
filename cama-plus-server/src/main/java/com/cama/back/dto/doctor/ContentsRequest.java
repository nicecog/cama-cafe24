package com.cama.back.dto.doctor;

import com.cama.back.dto.track.Disease;
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
public class ContentsRequest {

    private Long diseaseSeq;

    private String title;

    private String contents;

    private List<String> interest;

    private String image;

    private String careTimeType;

    private Disease disease;

    private boolean viewed;
    
    private Long priority;
    
    private String lang;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

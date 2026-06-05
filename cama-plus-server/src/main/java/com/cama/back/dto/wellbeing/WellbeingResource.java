package com.cama.back.dto.wellbeing;

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
public class WellbeingResource {

    private Long seq;

    private String wellbeingCategoryCd;

    private String wellbeingCategoryNm;

    private String companyName;

    private String companyDescription;

    private String title;

    private String contents;

    private String thumbnail;

    private String address;

    private String phoneNumber;

    private String homepage;

    private String sns;

    private boolean isEnabled;
    
    private Long priority;

    private String createdAt;

    private String updatedAt;
    
    private String lang; // KO, US
    

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

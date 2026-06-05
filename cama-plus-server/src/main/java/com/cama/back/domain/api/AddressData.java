package com.cama.back.domain.api;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddressData implements Serializable {

    private String jibunAddress;

    private String roadAddress;

    private String sido;

    private String sigungu;

    private String bname;

    private String bname1;

    private String bname2;

    private String roadname;

    private String detail;

    private String zipcode;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

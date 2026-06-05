package com.cama.back.domain.iamport;

import com.google.gson.annotations.SerializedName;
import lombok.*;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IamportResponseCertification {


    @SerializedName("response")
    private CertificationResponse response;

    @SerializedName("message")
    private String message;

    @SerializedName("code")
    private int code;

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.JSON_STYLE);
    }

}

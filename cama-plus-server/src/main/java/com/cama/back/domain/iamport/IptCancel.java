package com.cama.back.domain.iamport;


import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
public class IptCancel {

    @SerializedName("code")
    Long code;

    @SerializedName("message")
    String message;

    @SerializedName("response")
    IptResponse response;

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.JSON_STYLE);
    }

}

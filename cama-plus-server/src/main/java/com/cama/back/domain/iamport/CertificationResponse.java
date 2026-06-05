package com.cama.back.domain.iamport;

import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
public class CertificationResponse {

    @SerializedName("imp_uid")
    private String impUid;

    @SerializedName("merchant_uid")
    private String merchantUid;

    @SerializedName("pg_tid")
    private String pgTid;

    @SerializedName("pg_provider")
    private String pgProvider;

    @SerializedName("name")
    private String name;

    @SerializedName("phone")
    private String phone;

    @SerializedName("gender")
    private String gender;

    @SerializedName("birth")
    private int birth;

    @SerializedName("birthday")
    private String birthday;

    @SerializedName("foreigner")
    private boolean foreigner;

    @SerializedName("certified")
    private boolean certified;

    @SerializedName("certified_at")
    private int certifiedAt;

    @SerializedName("unique_key")
    private String uniqueKey;

    @SerializedName("unique_in_site")
    private String uniqueInSite;

    @SerializedName("origin")
    private String origin;

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.JSON_STYLE);
    }

}

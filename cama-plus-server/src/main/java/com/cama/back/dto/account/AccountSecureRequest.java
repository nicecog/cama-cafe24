package com.cama.back.dto.account;

import com.cama.back.domain.firebase.Firebase;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountSecureRequest {

    private String secureCode;

    @Schema(description = "파베 정보", requiredMode = Schema.RequiredMode.REQUIRED)
    private Firebase firebase;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

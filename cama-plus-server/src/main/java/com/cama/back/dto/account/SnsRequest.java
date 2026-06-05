package com.cama.back.dto.account;

import com.cama.back.domain.account.SignType;
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
public class SnsRequest {

    @Schema(description = "SNS 토큰", requiredMode = Schema.RequiredMode.REQUIRED)
    private String token;

    @Schema(description = "SNS 타입", requiredMode = Schema.RequiredMode.REQUIRED)
    private SignType signType;

    @Schema(description = "애플 계정 이름", requiredMode = Schema.RequiredMode.REQUIRED)
    private String appleId;

    @Schema(description = "파베 정보", requiredMode = Schema.RequiredMode.REQUIRED)
    private Firebase firebase;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

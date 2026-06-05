package com.cama.back.dto.account;

import com.cama.back.domain.account.SignType;
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
public class SignUpCheckRequest {

    @Schema(description = "SNS 토큰", requiredMode = Schema.RequiredMode.REQUIRED)
    private String token;

    @Schema(description = "SNS 타입", requiredMode = Schema.RequiredMode.REQUIRED)
    private SignType signType;

    @Schema(description = "애플 ID", requiredMode = Schema.RequiredMode.REQUIRED)
    private String appleId;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

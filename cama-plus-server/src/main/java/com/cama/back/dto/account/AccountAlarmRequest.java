package com.cama.back.dto.account;

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
public class AccountAlarmRequest {

    @Schema(description = "공지 알림")
    private boolean noticed;

    @Schema(description = "문의 알림")
    private boolean answered;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

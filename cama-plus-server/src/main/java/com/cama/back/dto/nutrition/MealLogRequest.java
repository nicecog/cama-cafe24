package com.cama.back.dto.nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealLogRequest {

    /** 클라이언트 생성 UUID. estimate 에서는 생략 가능 */
    private String clientLogId;

    /** BREAKFAST / LUNCH / DINNER / SNACK */
    private String mealTypeCd;

    /** ISO-8601 (예: 2026-08-08T12:30:00+09:00) */
    private String eatenAt;

    /** ONDEVICE / MANUAL */
    private String sourceCd;

    private String memo;

    private MealClientMeta clientMeta;

    private List<MealLogItemRequest> items;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

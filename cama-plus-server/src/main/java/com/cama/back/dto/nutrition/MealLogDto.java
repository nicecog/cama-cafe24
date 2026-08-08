package com.cama.back.dto.nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.math.BigDecimal;
import java.util.List;

/**
 * estimate 응답과 저장 응답이 동일 구조다. estimate 에서는 seq 가 null 이다.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealLogDto {

    private Long seq;
    private String clientLogId;
    private String mealTypeCd;

    /** yyyy-MM-dd HH:mm:ss (Asia/Seoul) */
    private String eatenAt;

    private String sourceCd;
    private BigDecimal totalKcal;
    private BigDecimal totalCarbG;
    private BigDecimal totalProteinG;
    private BigDecimal totalFatG;
    private boolean needsReview;
    private String nutritionVersion;
    private String memo;
    private List<MealLogItemDto> items;
    private MealGuideDto guide;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

package com.cama.back.dto.nutrition;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.math.BigDecimal;

/**
 * 일별 섭취 집계 (Asia/Seoul 기준).
 */
@Getter
@Setter
public class MealDailySummaryDto {

    /** yyyy-MM-dd */
    private String mealDate;

    private BigDecimal totalKcal;
    private BigDecimal totalCarbG;
    private BigDecimal totalProteinG;
    private BigDecimal totalFatG;
    private Integer mealCount;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

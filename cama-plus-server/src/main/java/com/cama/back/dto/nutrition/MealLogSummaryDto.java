package com.cama.back.dto.nutrition;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.math.BigDecimal;

/**
 * 기간별 목록 행. MyBatis 조회 결과를 그대로 담는다.
 */
@Getter
@Setter
public class MealLogSummaryDto {

    private Long seq;
    private String clientLogId;
    private String mealTypeCd;
    private String eatenAt;
    private String sourceCd;
    private BigDecimal totalKcal;
    private BigDecimal totalCarbG;
    private BigDecimal totalProteinG;
    private BigDecimal totalFatG;
    private boolean needsReview;
    private Integer itemCount;

    /** 대표 음식명 (쉼표 구분, 최대 3개) */
    private String itemNames;

    private String createdAt;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

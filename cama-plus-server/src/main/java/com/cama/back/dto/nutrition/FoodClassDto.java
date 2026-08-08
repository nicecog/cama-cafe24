package com.cama.back.dto.nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * 앱 catalog 항목. 값은 모두 100g 기준이다.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodClassDto {

    private Integer classId;
    private String classKey;
    private String nameKo;
    private String categoryNm;
    private BigDecimal servingG;
    private BigDecimal kcalPer100g;
    private BigDecimal carbPer100g;
    private BigDecimal proteinPer100g;
    private BigDecimal fatPer100g;
}

package com.cama.back.dto.nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealLogItemDto {

    private Long seq;
    private String classKey;
    private String nameKo;
    private String foodCode;
    private BigDecimal confidence;
    private BigDecimal portionFactor;
    private Integer quantity;
    private BigDecimal gramsG;
    private BigDecimal kcal;
    private BigDecimal carbG;
    private BigDecimal proteinG;
    private BigDecimal fatG;

    /** MFDS / CLASS_FALLBACK / NONE */
    private String nutritionSourceCd;

    /** 폴백 영양값 사용 여부 */
    private boolean estimated;

    private boolean userCorrected;
    private String originalClassKey;
    private Integer displayOrder;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

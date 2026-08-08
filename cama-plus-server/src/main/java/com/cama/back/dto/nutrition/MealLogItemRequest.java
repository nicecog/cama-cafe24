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

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealLogItemRequest {

    /** cm_food_class.class_key */
    private String classKey;

    /** 0 ~ 1 */
    private BigDecimal confidence;

    /** 0.25 ~ 5.0 */
    private BigDecimal portionFactor;

    /** 1 ~ 20 */
    private Integer quantity;

    private Boolean isUserCorrected;

    /** 사용자가 후보로 교체한 경우 모델 원본 예측값 */
    private String originalClassKey;

    /** 앱 미리보기 kcal. 서버 계산에 사용하지 않는다 */
    private BigDecimal clientKcalPreview;

    /** [x, y, w, h] 정규화 좌표 */
    private List<Double> bbox;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

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
public class MealFeedbackRequest {

    private Long mealLogItemSeq;

    /** 모델이 예측한 classKey */
    private String predictedClass;

    /** 사용자가 지정한 정답 classKey */
    private String correctedClass;

    private String modelVersion;

    private BigDecimal confidence;

    private String memo;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

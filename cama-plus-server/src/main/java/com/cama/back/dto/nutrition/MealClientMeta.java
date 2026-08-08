package com.cama.back.dto.nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

/**
 * 온디바이스 추론 메타. 저장은 하지만 계산에는 사용하지 않는다.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealClientMeta {

    /** 예: yolo26n-kd-416-int8@1.0.0 */
    private String modelVersion;

    private String catalogVersion;

    /** 416-int8 / 320-int8 */
    private String profile;

    private Integer inferenceMs;

    private String appVersion;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

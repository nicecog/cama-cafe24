package com.cama.back.dto.nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealLogQuery {

    private Long accountSeq;

    /** yyyy-MM-dd */
    private String fromDate;

    /** yyyy-MM-dd (해당 일자 포함) */
    private String toDate;

    private String mealTypeCd;

    private Integer limit;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }
}

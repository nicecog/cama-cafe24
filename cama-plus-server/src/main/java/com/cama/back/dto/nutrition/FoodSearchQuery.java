package com.cama.back.dto.nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodSearchQuery {

    /** 한글명 또는 classKey 부분 일치 */
    private String keyword;

    private Integer limit;
}

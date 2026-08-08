package com.cama.back.dto.nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealGuideDto {

    private String headline;

    private List<String> messages;

    /** 의료기기 오인 방지 고지. 항상 포함한다 */
    private String disclaimer;
}

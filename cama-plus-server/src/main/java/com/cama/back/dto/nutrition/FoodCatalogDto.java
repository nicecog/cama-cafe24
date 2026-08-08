package com.cama.back.dto.nutrition;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

/**
 * catalog 전체 또는 델타. since 를 생략하면 changed 에 전체 목록이 담긴다.
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodCatalogDto {

    /** 1.0.{maxUpdatedAtEpochSeconds} — 단조 증가 토큰 */
    private String catalogVersion;

    private boolean full;

    private List<FoodClassDto> changed;

    /** 비활성화된 classKey 목록 */
    private List<String> removed;
}

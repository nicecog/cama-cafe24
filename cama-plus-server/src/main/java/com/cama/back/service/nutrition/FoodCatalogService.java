package com.cama.back.service.nutrition;

import com.cama.back.domain.nutrition.CmFoodClass;
import com.cama.back.dto.nutrition.FoodCatalogDto;
import com.cama.back.dto.nutrition.FoodClassDto;
import com.cama.back.dto.nutrition.FoodSearchQuery;
import com.cama.back.repo.nutrition.FoodClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.List;

/**
 * 앱 번들 catalog 갱신용 조회.
 * <p>
 * catalogVersion 은 {@code 1.0.<max(updated_at) epochSecond>} 형태의 단조 증가 토큰이다.
 * 별도 버전 컬럼 없이 마스터 변경만으로 델타를 계산할 수 있다.
 */
@Service
@RequiredArgsConstructor
public class FoodCatalogService {

    private static final String VERSION_PREFIX = "1.0.";
    private static final int DEFAULT_SEARCH_LIMIT = 30;
    private static final int MAX_SEARCH_LIMIT = 100;

    private final FoodClassRepository foodClassRepository;

    @Transactional(readOnly = true)
    public FoodCatalogDto catalog(String since) {
        String catalogVersion = toVersion(foodClassRepository.findLatestUpdatedAt().orElse(null));
        Long sinceEpochSecond = parseSince(since);

        if (sinceEpochSecond == null) {
            List<CmFoodClass> all = foodClassRepository.findByEnabledOrderByClassIdAsc(true);
            return FoodCatalogDto.builder()
                    .catalogVersion(catalogVersion)
                    .full(true)
                    .changed(all.stream().map(FoodCatalogService::toDto).toList())
                    .removed(List.of())
                    .build();
        }

        OffsetDateTime sinceTime = Instant.ofEpochSecond(sinceEpochSecond).atOffset(ZoneOffset.UTC);
        List<FoodClassDto> changed = new ArrayList<>();
        List<String> removed = new ArrayList<>();
        for (CmFoodClass foodClass : foodClassRepository.findChangedSince(sinceTime)) {
            if (foodClass.isEnabled()) {
                changed.add(toDto(foodClass));
            } else {
                removed.add(foodClass.getClassKey());
            }
        }

        return FoodCatalogDto.builder()
                .catalogVersion(catalogVersion)
                .full(false)
                .changed(changed)
                .removed(removed)
                .build();
    }

    @Transactional(readOnly = true)
    public List<FoodClassDto> search(FoodSearchQuery query) {
        if (query == null || !StringUtils.hasText(query.getKeyword())) {
            throw new IllegalArgumentException("keyword가 필요합니다.");
        }
        int limit = query.getLimit() == null || query.getLimit() <= 0
                ? DEFAULT_SEARCH_LIMIT
                : Math.min(query.getLimit(), MAX_SEARCH_LIMIT);

        return foodClassRepository.searchByKeyword(query.getKeyword().trim())
                .stream()
                .limit(limit)
                .map(FoodCatalogService::toDto)
                .toList();
    }

    private static FoodClassDto toDto(CmFoodClass foodClass) {
        return FoodClassDto.builder()
                .classId(foodClass.getClassId())
                .classKey(foodClass.getClassKey())
                .nameKo(foodClass.getNameKo())
                .categoryNm(foodClass.getCategoryNm())
                .servingG(foodClass.getServingG())
                .kcalPer100g(foodClass.getFbKcal())
                .carbPer100g(foodClass.getFbCarbG())
                .proteinPer100g(foodClass.getFbProteinG())
                .fatPer100g(foodClass.getFbFatG())
                .build();
    }

    private static String toVersion(OffsetDateTime latestUpdatedAt) {
        long epochSecond = latestUpdatedAt == null ? 0L : latestUpdatedAt.toEpochSecond();
        return VERSION_PREFIX + epochSecond;
    }

    /**
     * {@code 1.0.<epochSecond>} 또는 epochSecond 단독 문자열을 허용한다.
     * 해석할 수 없으면 null 을 반환해 전체 목록으로 처리한다.
     */
    private static Long parseSince(String since) {
        if (!StringUtils.hasText(since)) {
            return null;
        }
        String candidate = since.trim();
        if (candidate.startsWith(VERSION_PREFIX)) {
            candidate = candidate.substring(VERSION_PREFIX.length());
        }
        try {
            return Long.parseLong(candidate);
        } catch (NumberFormatException e) {
            return null;
        }
    }
}

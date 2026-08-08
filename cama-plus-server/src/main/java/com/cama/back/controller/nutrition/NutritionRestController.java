package com.cama.back.controller.nutrition;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.nutrition.FoodCatalogDto;
import com.cama.back.dto.nutrition.FoodClassDto;
import com.cama.back.dto.nutrition.FoodSearchQuery;
import com.cama.back.dto.nutrition.MealDailySummaryDto;
import com.cama.back.dto.nutrition.MealDeleteRequest;
import com.cama.back.dto.nutrition.MealFeedbackRequest;
import com.cama.back.dto.nutrition.MealLogDto;
import com.cama.back.dto.nutrition.MealLogQuery;
import com.cama.back.dto.nutrition.MealLogRequest;
import com.cama.back.dto.nutrition.MealLogSummaryDto;
import com.cama.back.security.JwtAuthentication;
import com.cama.back.service.nutrition.FoodCatalogService;
import com.cama.back.service.nutrition.MealLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * 음식 사진 칼로리 기록 API.
 * <p>
 * 식사 기록은 개인 데이터이므로 webview 미인증 미러를 만들지 않고 JWT 를 필수로 둔다.
 */
@RestController
@RequestMapping("api")
@Tag(name = "Nutrition")
@RequiredArgsConstructor
public class NutritionRestController {

    private final MealLogService mealLogService;
    private final FoodCatalogService foodCatalogService;

    @PostMapping(path = "nutrition/meal/estimate")
    @Operation(summary = "식사 칼로리 계산 (저장하지 않음)")
    public ApiResult<MealLogDto> estimateMeal(@AuthenticationPrincipal JwtAuthentication authentication,
                                              @RequestBody MealLogRequest request) {
        return new ApiResult<>(mealLogService.estimate(authentication.id.value(), request));
    }

    @PostMapping(path = "nutrition/meal")
    @Operation(summary = "식사 기록 저장 (clientLogId 멱등)")
    public ApiResult<MealLogDto> saveMeal(@AuthenticationPrincipal JwtAuthentication authentication,
                                          @RequestBody MealLogRequest request) {
        return new ApiResult<>(mealLogService.create(authentication.id.value(), request));
    }

    @PutMapping(path = "nutrition/meal/{seq}")
    @Operation(summary = "식사 기록 수정 (항목 재계산)")
    public ApiResult<MealLogDto> updateMeal(@AuthenticationPrincipal JwtAuthentication authentication,
                                           @PathVariable Long seq,
                                           @RequestBody MealLogRequest request) {
        return new ApiResult<>(mealLogService.update(seq, authentication.id.value(), request));
    }

    @GetMapping(path = "nutrition/meal/{seq}")
    @Operation(summary = "식사 기록 단건 조회")
    public ApiResult<MealLogDto> getMeal(@AuthenticationPrincipal JwtAuthentication authentication,
                                        @PathVariable Long seq) {
        return new ApiResult<>(mealLogService.detail(seq, authentication.id.value()));
    }

    @PostMapping(path = "nutrition/meal/delete")
    @Operation(summary = "식사 기록 삭제 (소프트)")
    public ApiResult<Boolean> deleteMeal(@AuthenticationPrincipal JwtAuthentication authentication,
                                        @RequestBody MealDeleteRequest request) {
        if (request == null || request.getSeq() == null) {
            throw new IllegalArgumentException("seq가 필요합니다.");
        }
        return new ApiResult<>(mealLogService.delete(request.getSeq(), authentication.id.value()));
    }

    @PostMapping(path = "nutrition/mealList")
    @Operation(summary = "기간별 식사 기록 목록")
    public ApiResult<List<MealLogSummaryDto>> getMealList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                         @RequestBody MealLogQuery query) {
        query.setAccountSeq(authentication.id.value());
        return new ApiResult<>(mealLogService.list(query));
    }

    @PostMapping(path = "nutrition/mealDailySummary")
    @Operation(summary = "일별 섭취 집계")
    public ApiResult<List<MealDailySummaryDto>> getMealDailySummary(
            @AuthenticationPrincipal JwtAuthentication authentication,
            @RequestBody MealLogQuery query) {
        query.setAccountSeq(authentication.id.value());
        return new ApiResult<>(mealLogService.dailySummary(query));
    }

    @GetMapping(path = "nutrition/catalog")
    @Operation(summary = "앱 catalog 조회. since 를 주면 델타만 반환")
    public ApiResult<FoodCatalogDto> getCatalog(@RequestParam(required = false) String since) {
        return new ApiResult<>(foodCatalogService.catalog(since));
    }

    @PostMapping(path = "nutrition/food/search")
    @Operation(summary = "음식 검색 (수동 추가·후보 교체 폴백)")
    public ApiResult<List<FoodClassDto>> searchFood(@RequestBody FoodSearchQuery query) {
        return new ApiResult<>(foodCatalogService.search(query));
    }

    @PostMapping(path = "nutrition/meal/feedback")
    @Operation(summary = "오분류 피드백 수집")
    public ApiResult<Map<String, Long>> saveFeedback(@AuthenticationPrincipal JwtAuthentication authentication,
                                                     @RequestBody MealFeedbackRequest request) {
        Long seq = mealLogService.saveFeedback(authentication.id.value(), request);
        return new ApiResult<>(Map.of("seq", seq));
    }
}

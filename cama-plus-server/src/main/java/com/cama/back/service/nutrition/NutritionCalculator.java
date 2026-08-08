package com.cama.back.service.nutrition;

import com.cama.back.domain.nutrition.AccountMealLogItem;
import com.cama.back.domain.nutrition.CmFoodClass;
import com.cama.back.domain.nutrition.CmFoodNutrition;
import com.cama.back.domain.nutrition.NutritionSource;
import com.cama.back.dto.nutrition.MealLogItemRequest;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

/**
 * 칼로리·매크로 계산 규칙의 단일 지점.
 * <p>
 * 클라이언트가 보낸 kcal 은 어떤 경로로도 계산에 사용하지 않는다.
 * grams = servingG x portionFactor x quantity 이며, 영양값은 100g 기준을 grams 로 환산한다.
 */
@Component
public class NutritionCalculator {

    public static final BigDecimal MIN_PORTION_FACTOR = new BigDecimal("0.25");
    public static final BigDecimal MAX_PORTION_FACTOR = new BigDecimal("5.0");
    public static final int MIN_QUANTITY = 1;
    public static final int MAX_QUANTITY = 20;
    public static final int MAX_ITEMS = 20;

    /** 이 값 미만이고 사용자가 확인하지 않은 항목은 확인 필요로 표시한다 */
    public static final BigDecimal LOW_CONFIDENCE_THRESHOLD = new BigDecimal("0.35");

    private static final BigDecimal HUNDRED = new BigDecimal("100");
    private static final BigDecimal DEFAULT_PORTION_FACTOR = BigDecimal.ONE;
    private static final int KCAL_SCALE = 0;
    private static final int MACRO_SCALE = 1;
    private static final int GRAM_SCALE = 2;

    /**
     * 항목 하나를 계산해 아직 저장되지 않은 엔티티로 만든다.
     *
     * @param nutrition 식약처 정본. null 이면 클래스 폴백을 사용한다
     */
    public AccountMealLogItem calculateItem(MealLogItemRequest request,
                                           CmFoodClass foodClass,
                                           CmFoodNutrition nutrition,
                                           int displayOrder) {
        BigDecimal portionFactor = normalizePortionFactor(request.getPortionFactor());
        int quantity = normalizeQuantity(request.getQuantity());
        BigDecimal confidence = normalizeConfidence(request.getConfidence());

        BigDecimal grams = foodClass.getServingG()
                .multiply(portionFactor)
                .multiply(BigDecimal.valueOf(quantity))
                .setScale(GRAM_SCALE, RoundingMode.HALF_UP);

        NutritionSource source;
        String foodCode;
        BigDecimal kcalPer100g;
        BigDecimal carbPer100g;
        BigDecimal proteinPer100g;
        BigDecimal fatPer100g;

        if (nutrition != null && nutrition.getKcal() != null) {
            source = NutritionSource.MFDS;
            foodCode = nutrition.getFoodCode();
            kcalPer100g = nutrition.getKcal();
            carbPer100g = nutrition.getCarbG();
            proteinPer100g = nutrition.getProteinG();
            fatPer100g = nutrition.getFatG();
        } else if (foodClass.hasFallbackNutrition()) {
            source = NutritionSource.CLASS_FALLBACK;
            foodCode = foodClass.getFoodCode();
            kcalPer100g = foodClass.getFbKcal();
            carbPer100g = foodClass.getFbCarbG();
            proteinPer100g = foodClass.getFbProteinG();
            fatPer100g = foodClass.getFbFatG();
        } else {
            source = NutritionSource.NONE;
            foodCode = foodClass.getFoodCode();
            kcalPer100g = null;
            carbPer100g = null;
            proteinPer100g = null;
            fatPer100g = null;
        }

        boolean estimated = source != NutritionSource.MFDS;

        return AccountMealLogItem.builder()
                .classKey(foodClass.getClassKey())
                .nameKo(foodClass.getNameKo())
                .foodCode(foodCode)
                .confidence(confidence)
                .portionFactor(portionFactor)
                .quantity(quantity)
                .gramsG(grams)
                .kcal(scaleToGrams(kcalPer100g, grams, KCAL_SCALE))
                .carbG(scaleToGrams(carbPer100g, grams, MACRO_SCALE))
                .proteinG(scaleToGrams(proteinPer100g, grams, MACRO_SCALE))
                .fatG(scaleToGrams(fatPer100g, grams, MACRO_SCALE))
                .nutritionSourceCd(source)
                .estimated(estimated)
                .userCorrected(Boolean.TRUE.equals(request.getIsUserCorrected()))
                .originalClassKey(request.getOriginalClassKey())
                .clientKcalPreview(request.getClientKcalPreview())
                .bbox(request.getBbox())
                .displayOrder(displayOrder)
                .build();
    }

    public Totals sum(List<AccountMealLogItem> items) {
        BigDecimal kcal = BigDecimal.ZERO;
        BigDecimal carb = BigDecimal.ZERO;
        BigDecimal protein = BigDecimal.ZERO;
        BigDecimal fat = BigDecimal.ZERO;
        boolean needsReview = false;

        for (AccountMealLogItem item : items) {
            kcal = kcal.add(nullToZero(item.getKcal()));
            carb = carb.add(nullToZero(item.getCarbG()));
            protein = protein.add(nullToZero(item.getProteinG()));
            fat = fat.add(nullToZero(item.getFatG()));
            if (requiresReview(item)) {
                needsReview = true;
            }
        }

        return new Totals(
                kcal.setScale(KCAL_SCALE, RoundingMode.HALF_UP),
                carb.setScale(MACRO_SCALE, RoundingMode.HALF_UP),
                protein.setScale(MACRO_SCALE, RoundingMode.HALF_UP),
                fat.setScale(MACRO_SCALE, RoundingMode.HALF_UP),
                needsReview);
    }

    public BigDecimal normalizePortionFactor(BigDecimal value) {
        if (value == null) {
            return DEFAULT_PORTION_FACTOR;
        }
        if (value.compareTo(MIN_PORTION_FACTOR) < 0 || value.compareTo(MAX_PORTION_FACTOR) > 0) {
            throw new IllegalArgumentException(
                    "portionFactor는 " + MIN_PORTION_FACTOR.toPlainString()
                            + " ~ " + MAX_PORTION_FACTOR.toPlainString() + " 범위여야 합니다.");
        }
        return value;
    }

    public int normalizeQuantity(Integer value) {
        if (value == null) {
            return MIN_QUANTITY;
        }
        if (value < MIN_QUANTITY || value > MAX_QUANTITY) {
            throw new IllegalArgumentException(
                    "quantity는 " + MIN_QUANTITY + " ~ " + MAX_QUANTITY + " 범위여야 합니다.");
        }
        return value;
    }

    private static BigDecimal normalizeConfidence(BigDecimal value) {
        if (value == null) {
            return null;
        }
        if (value.compareTo(BigDecimal.ZERO) < 0 || value.compareTo(BigDecimal.ONE) > 0) {
            throw new IllegalArgumentException("confidence는 0 ~ 1 범위여야 합니다.");
        }
        return value.setScale(4, RoundingMode.HALF_UP);
    }

    private static boolean requiresReview(AccountMealLogItem item) {
        if (item.isEstimated()) {
            return true;
        }
        BigDecimal confidence = item.getConfidence();
        return confidence != null
                && !item.isUserCorrected()
                && confidence.compareTo(LOW_CONFIDENCE_THRESHOLD) < 0;
    }

    private static BigDecimal scaleToGrams(BigDecimal per100g, BigDecimal grams, int scale) {
        if (per100g == null) {
            return BigDecimal.ZERO.setScale(scale, RoundingMode.HALF_UP);
        }
        return per100g.multiply(grams)
                .divide(HUNDRED, scale + 4, RoundingMode.HALF_UP)
                .setScale(scale, RoundingMode.HALF_UP);
    }

    private static BigDecimal nullToZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }

    public record Totals(BigDecimal kcal,
                         BigDecimal carbG,
                         BigDecimal proteinG,
                         BigDecimal fatG,
                         boolean needsReview) {
    }
}

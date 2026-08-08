package com.cama.back.service.nutrition;

import com.cama.back.domain.nutrition.AccountMealLogItem;
import com.cama.back.domain.nutrition.CmFoodClass;
import com.cama.back.domain.nutrition.CmFoodNutrition;
import com.cama.back.domain.nutrition.NutritionSource;
import com.cama.back.dto.nutrition.MealLogItemRequest;
import org.junit.jupiter.api.Test;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

class NutritionCalculatorTest {

    private final NutritionCalculator calculator = new NutritionCalculator();

    private static CmFoodClass gimbap() {
        return CmFoodClass.builder()
                .classId(2)
                .classKey("gimbap")
                .nameKo("김밥")
                .servingG(new BigDecimal("230"))
                .fbKcal(new BigDecimal("145"))
                .fbCarbG(new BigDecimal("26.5"))
                .fbProteinG(new BigDecimal("4.6"))
                .fbFatG(new BigDecimal("2.8"))
                .enabled(true)
                .build();
    }

    private static MealLogItemRequest request(String portionFactor, Integer quantity, String confidence) {
        return MealLogItemRequest.builder()
                .classKey("gimbap")
                .portionFactor(portionFactor == null ? null : new BigDecimal(portionFactor))
                .quantity(quantity)
                .confidence(confidence == null ? null : new BigDecimal(confidence))
                .build();
    }

    @Test
    void useClassFallbackWhenFoodCodeIsNotMapped() {
        AccountMealLogItem item = calculator.calculateItem(request("1.0", 1, "0.91"), gimbap(), null, 0);

        assertEquals(NutritionSource.CLASS_FALLBACK, item.getNutritionSourceCd());
        assertTrue(item.isEstimated());
        assertEquals("230.00", item.getGramsG().toPlainString());
        // 145 x 230 / 100 = 333.5 -> 334 (kcal 정수 반올림)
        assertEquals("334", item.getKcal().toPlainString());
        assertEquals("61.0", item.getCarbG().toPlainString());
        assertEquals("10.6", item.getProteinG().toPlainString());
        assertEquals("6.4", item.getFatG().toPlainString());
    }

    @Test
    void preferOfficialNutritionOverFallback() {
        CmFoodClass foodClass = gimbap();
        foodClass.setFoodCode("D000123");
        CmFoodNutrition nutrition = CmFoodNutrition.builder()
                .foodCode("D000123")
                .foodName("김밥")
                .nutritionVersion("MFDS-2026.1")
                .kcal(new BigDecimal("200"))
                .carbG(new BigDecimal("30"))
                .proteinG(new BigDecimal("6"))
                .fatG(new BigDecimal("5"))
                .enabled(true)
                .build();

        AccountMealLogItem item = calculator.calculateItem(request("1.0", 1, "0.91"), foodClass, nutrition, 0);

        assertEquals(NutritionSource.MFDS, item.getNutritionSourceCd());
        assertFalse(item.isEstimated());
        assertEquals("D000123", item.getFoodCode());
        assertEquals("460", item.getKcal().toPlainString());
    }

    @Test
    void gramsScaleWithPortionFactorAndQuantity() {
        AccountMealLogItem item = calculator.calculateItem(request("0.5", 3, null), gimbap(), null, 0);

        // 230 x 0.5 x 3 = 345
        assertEquals("345.00", item.getGramsG().toPlainString());
        // 145 x 345 / 100 = 500.25 -> 500
        assertEquals("500", item.getKcal().toPlainString());
    }

    @Test
    void zeroNutritionWhenNeitherOfficialNorFallbackExists() {
        CmFoodClass foodClass = gimbap();
        foodClass.setFbKcal(null);

        AccountMealLogItem item = calculator.calculateItem(request("1.0", 1, "0.95"), foodClass, null, 0);

        assertEquals(NutritionSource.NONE, item.getNutritionSourceCd());
        assertTrue(item.isEstimated());
        assertEquals(0, item.getKcal().compareTo(BigDecimal.ZERO));
    }

    @Test
    void ignoreClientKcalPreviewInCalculation() {
        MealLogItemRequest request = request("1.0", 1, "0.91");
        request.setClientKcalPreview(new BigDecimal("9999"));

        AccountMealLogItem item = calculator.calculateItem(request, gimbap(), null, 0);

        assertEquals("334", item.getKcal().toPlainString());
        assertEquals("9999", item.getClientKcalPreview().toPlainString());
    }

    @Test
    void rejectPortionFactorOutOfRange() {
        assertThrows(IllegalArgumentException.class,
                () -> calculator.calculateItem(request("0.1", 1, null), gimbap(), null, 0));
        assertThrows(IllegalArgumentException.class,
                () -> calculator.calculateItem(request("6.0", 1, null), gimbap(), null, 0));
    }

    @Test
    void rejectQuantityOutOfRange() {
        assertThrows(IllegalArgumentException.class,
                () -> calculator.calculateItem(request("1.0", 0, null), gimbap(), null, 0));
        assertThrows(IllegalArgumentException.class,
                () -> calculator.calculateItem(request("1.0", 21, null), gimbap(), null, 0));
    }

    @Test
    void rejectConfidenceOutOfRange() {
        assertThrows(IllegalArgumentException.class,
                () -> calculator.calculateItem(request("1.0", 1, "1.5"), gimbap(), null, 0));
    }

    @Test
    void totalsSumItemsAndRoundOnce() {
        CmFoodClass official = gimbap();
        official.setFoodCode("D000123");
        CmFoodNutrition nutrition = CmFoodNutrition.builder()
                .foodCode("D000123")
                .nutritionVersion("MFDS-2026.1")
                .kcal(new BigDecimal("100"))
                .carbG(new BigDecimal("10"))
                .proteinG(new BigDecimal("5"))
                .fatG(new BigDecimal("2"))
                .enabled(true)
                .build();

        List<AccountMealLogItem> items = List.of(
                calculator.calculateItem(request("1.0", 1, "0.90"), official, nutrition, 0),
                calculator.calculateItem(request("1.0", 1, "0.80"), official, nutrition, 1));

        NutritionCalculator.Totals totals = calculator.sum(items);

        assertEquals("460", totals.kcal().toPlainString());
        assertEquals("46.0", totals.carbG().toPlainString());
        assertEquals("23.0", totals.proteinG().toPlainString());
        assertEquals("9.2", totals.fatG().toPlainString());
        assertFalse(totals.needsReview());
    }

    @Test
    void needsReviewWhenConfidenceIsLowAndUserDidNotConfirm() {
        CmFoodClass official = gimbap();
        official.setFoodCode("D000123");
        CmFoodNutrition nutrition = CmFoodNutrition.builder()
                .foodCode("D000123")
                .nutritionVersion("MFDS-2026.1")
                .kcal(new BigDecimal("100"))
                .enabled(true)
                .build();

        AccountMealLogItem lowConfidence =
                calculator.calculateItem(request("1.0", 1, "0.20"), official, nutrition, 0);

        assertTrue(calculator.sum(List.of(lowConfidence)).needsReview());
    }

    @Test
    void doNotFlagLowConfidenceItemCorrectedByUser() {
        CmFoodClass official = gimbap();
        official.setFoodCode("D000123");
        CmFoodNutrition nutrition = CmFoodNutrition.builder()
                .foodCode("D000123")
                .nutritionVersion("MFDS-2026.1")
                .kcal(new BigDecimal("100"))
                .enabled(true)
                .build();

        MealLogItemRequest request = request("1.0", 1, "0.20");
        request.setIsUserCorrected(true);
        request.setOriginalClassKey("bibimbap");

        AccountMealLogItem item = calculator.calculateItem(request, official, nutrition, 0);

        assertTrue(item.isUserCorrected());
        assertFalse(calculator.sum(List.of(item)).needsReview());
    }

    @Test
    void needsReviewWhenAnyItemUsesFallback() {
        AccountMealLogItem fallback = calculator.calculateItem(request("1.0", 1, "0.99"), gimbap(), null, 0);

        assertTrue(calculator.sum(List.of(fallback)).needsReview());
    }
}

package com.cama.back.service.nutrition;

import com.cama.back.domain.nutrition.AccountMealLogItem;
import com.cama.back.domain.nutrition.MealType;
import com.cama.back.domain.nutrition.NutritionSource;
import com.cama.back.dto.nutrition.MealGuideDto;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 식사 기록에 붙는 참고용 안내 문구 생성.
 * <p>
 * 진단·처방으로 읽힐 수 있는 표현은 사용하지 않고, 항상 disclaimer 를 포함한다.
 */
@Service
public class MealGuideService {

    public static final String DISCLAIMER = "촬영 기반 추정값이며 의료적 판단의 근거로 사용하지 마세요.";

    /** 식사 구분별 권장 상한 kcal (성인 일반 기준 참고값) */
    private static final Map<MealType, Integer> UPPER_KCAL = Map.of(
            MealType.BREAKFAST, 600,
            MealType.LUNCH, 800,
            MealType.DINNER, 800,
            MealType.SNACK, 250
    );

    private static final BigDecimal KCAL_PER_CARB_G = new BigDecimal("4");
    private static final BigDecimal KCAL_PER_PROTEIN_G = new BigDecimal("4");
    private static final BigDecimal KCAL_PER_FAT_G = new BigDecimal("9");

    public MealGuideDto build(MealType mealType,
                              NutritionCalculator.Totals totals,
                              List<AccountMealLogItem> items) {
        List<String> messages = new ArrayList<>();

        int kcal = totals.kcal().intValue();
        Integer upper = UPPER_KCAL.get(mealType);
        if (upper != null && kcal > upper) {
            messages.add(mealType.labelKo() + " 권장 참고값(" + upper + "kcal)보다 "
                    + (kcal - upper) + "kcal 많습니다. 다음 식사에서 양을 조절해 보세요.");
        }

        appendMacroBalanceMessages(totals, messages);

        if (items.stream().anyMatch(item -> item.getNutritionSourceCd() == NutritionSource.NONE)) {
            messages.add("영양 정보가 등록되지 않은 항목이 있어 열량 합계에서 제외되었습니다.");
        } else if (items.stream().anyMatch(AccountMealLogItem::isEstimated)) {
            messages.add("일부 항목은 음식 종류의 대표 영양값으로 추정되었습니다.");
        }

        if (totals.needsReview()) {
            messages.add("인식 신뢰도가 낮은 항목이 있습니다. 목록을 확인하고 필요하면 수정해 주세요.");
        }

        return MealGuideDto.builder()
                .headline(buildHeadline(mealType, kcal, items.size()))
                .messages(messages)
                .disclaimer(DISCLAIMER)
                .build();
    }

    private static String buildHeadline(MealType mealType, int kcal, int itemCount) {
        String label = mealType == null ? "식사" : mealType.labelKo();
        return label + " " + itemCount + "개 항목, 약 " + kcal + "kcal입니다.";
    }

    private static void appendMacroBalanceMessages(NutritionCalculator.Totals totals, List<String> messages) {
        BigDecimal carbKcal = nullToZero(totals.carbG()).multiply(KCAL_PER_CARB_G);
        BigDecimal proteinKcal = nullToZero(totals.proteinG()).multiply(KCAL_PER_PROTEIN_G);
        BigDecimal fatKcal = nullToZero(totals.fatG()).multiply(KCAL_PER_FAT_G);
        BigDecimal macroKcal = carbKcal.add(proteinKcal).add(fatKcal);

        // 매크로 합이 너무 작으면 비율 판단이 무의미하다 (음료 단독 기록 등)
        if (macroKcal.compareTo(new BigDecimal("50")) < 0) {
            return;
        }

        int carbPct = percent(carbKcal, macroKcal);
        int proteinPct = percent(proteinKcal, macroKcal);
        int fatPct = percent(fatKcal, macroKcal);

        if (proteinPct < 12) {
            messages.add("단백질 비중이 " + proteinPct + "%로 낮습니다. 계란·두부·생선을 곁들여 보세요.");
        }
        if (fatPct > 35) {
            messages.add("지방 비중이 " + fatPct + "%로 높습니다. 튀김·기름진 조리를 줄여 보세요.");
        }
        if (carbPct > 65) {
            messages.add("탄수화물 비중이 " + carbPct + "%로 높습니다. 반찬으로 단백질과 채소를 더해 보세요.");
        }
    }

    private static int percent(BigDecimal part, BigDecimal total) {
        return part.multiply(new BigDecimal("100"))
                .divide(total, 0, RoundingMode.HALF_UP)
                .intValue();
    }

    private static BigDecimal nullToZero(BigDecimal value) {
        return value == null ? BigDecimal.ZERO : value;
    }
}

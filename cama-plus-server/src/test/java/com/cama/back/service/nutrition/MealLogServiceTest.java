package com.cama.back.service.nutrition;

import com.cama.back.domain.nutrition.AccountMealLog;
import com.cama.back.domain.nutrition.AccountMealLogItem;
import com.cama.back.domain.nutrition.CmFoodClass;
import com.cama.back.domain.nutrition.MealSource;
import com.cama.back.domain.nutrition.MealType;
import com.cama.back.domain.nutrition.NutritionSource;
import com.cama.back.dto.nutrition.MealLogDto;
import com.cama.back.dto.nutrition.MealLogItemRequest;
import com.cama.back.dto.nutrition.MealLogRequest;
import com.cama.back.exception.nutrition.FoodClassNotFoundException;
import com.cama.back.mapper.NutritionMapper;
import com.cama.back.repo.nutrition.FoodClassRepository;
import com.cama.back.repo.nutrition.FoodNutritionRepository;
import com.cama.back.repo.nutrition.MealFeedbackRepository;
import com.cama.back.repo.nutrition.MealLogRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.dao.DataIntegrityViolationException;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyBoolean;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class MealLogServiceTest {

    private static final DateTimeFormatter INPUT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final Long ACCOUNT_SEQ = 558L;

    @Mock
    private MealLogRepository mealLogRepository;
    @Mock
    private FoodClassRepository foodClassRepository;
    @Mock
    private FoodNutritionRepository foodNutritionRepository;
    @Mock
    private MealFeedbackRepository mealFeedbackRepository;
    @Mock
    private NutritionMapper nutritionMapper;
    @Mock
    private MealLogWriter mealLogWriter;

    private MealLogService mealLogService;

    @BeforeEach
    void setUp() {
        mealLogService = new MealLogService(
                mealLogRepository,
                foodClassRepository,
                foodNutritionRepository,
                mealFeedbackRepository,
                nutritionMapper,
                new NutritionCalculator(),
                new MealGuideService(),
                mealLogWriter);

        when(foodClassRepository.findByClassKeyInAndEnabled(anyCollection(), anyBoolean()))
                .thenReturn(List.of(gimbapClass()));
        when(foodNutritionRepository.findLatestVersion()).thenReturn(Optional.empty());
    }

    private static CmFoodClass gimbapClass() {
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

    private static MealLogRequest request(String clientLogId, String eatenAt) {
        return MealLogRequest.builder()
                .clientLogId(clientLogId)
                .mealTypeCd("LUNCH")
                .sourceCd("ONDEVICE")
                .eatenAt(eatenAt)
                .items(List.of(MealLogItemRequest.builder()
                        .classKey("gimbap")
                        .confidence(new BigDecimal("0.91"))
                        .portionFactor(BigDecimal.ONE)
                        .quantity(1)
                        .clientKcalPreview(new BigDecimal("9999"))
                        .build()))
                .build();
    }

    private static String oneHourAgo() {
        return OffsetDateTime.now().minusHours(1).format(INPUT);
    }

    @Test
    void estimateCalculatesWithoutSaving() {
        MealLogDto dto = mealLogService.estimate(ACCOUNT_SEQ, request(null, oneHourAgo()));

        assertNull(dto.getSeq());
        assertEquals("LUNCH", dto.getMealTypeCd());
        assertEquals("334", dto.getTotalKcal().toPlainString());
        assertEquals(MealLogService.FALLBACK_NUTRITION_VERSION, dto.getNutritionVersion());
        assertTrue(dto.isNeedsReview());
        assertNotNull(dto.getGuide().getDisclaimer());
        verify(mealLogWriter, never()).insert(any());
        verify(mealLogRepository, never()).save(any());
    }

    @Test
    void rejectUnknownClassKey() {
        when(foodClassRepository.findByClassKeyInAndEnabled(anyCollection(), anyBoolean()))
                .thenReturn(List.of());

        assertThrows(FoodClassNotFoundException.class,
                () -> mealLogService.estimate(ACCOUNT_SEQ, request(null, oneHourAgo())));
    }

    @Test
    void createSavesServerCalculatedTotals() {
        when(mealLogWriter.insert(any(AccountMealLog.class))).thenAnswer(invocation -> {
            AccountMealLog saved = invocation.getArgument(0);
            saved.setSeq(10482L);
            return saved;
        });

        String clientLogId = UUID.randomUUID().toString();
        MealLogDto dto = mealLogService.create(ACCOUNT_SEQ, request(clientLogId, oneHourAgo()));

        assertEquals(10482L, dto.getSeq());
        assertEquals(clientLogId, dto.getClientLogId());
        assertEquals("334", dto.getTotalKcal().toPlainString());
        assertEquals(1, dto.getItems().size());
        assertEquals(NutritionSource.CLASS_FALLBACK.getValue(), dto.getItems().get(0).getNutritionSourceCd());
        // 클라이언트 미리보기 값(9999)은 응답에도 계산에도 반영되지 않는다
        assertEquals("334", dto.getItems().get(0).getKcal().toPlainString());
    }

    @Test
    void createIsIdempotentWhenClientLogIdAlreadyStored() {
        String clientLogId = UUID.randomUUID().toString();
        when(mealLogWriter.insert(any(AccountMealLog.class)))
                .thenThrow(new DataIntegrityViolationException("duplicate key"));
        when(mealLogRepository.findDetailByClientLogId(eq(ACCOUNT_SEQ), eq(clientLogId)))
                .thenReturn(Optional.of(storedLog(clientLogId)));

        MealLogDto dto = mealLogService.create(ACCOUNT_SEQ, request(clientLogId, oneHourAgo()));

        assertEquals(777L, dto.getSeq());
        assertEquals(clientLogId, dto.getClientLogId());
        verify(mealLogRepository, never()).save(any());
    }

    @Test
    void rejectMissingClientLogIdOnCreate() {
        assertThrows(IllegalArgumentException.class,
                () -> mealLogService.create(ACCOUNT_SEQ, request(null, oneHourAgo())));
    }

    @Test
    void rejectNonUuidClientLogId() {
        assertThrows(IllegalArgumentException.class,
                () -> mealLogService.create(ACCOUNT_SEQ, request("not-a-uuid", oneHourAgo())));
    }

    @Test
    void rejectFutureEatenAt() {
        String future = OffsetDateTime.now().plusDays(1).format(INPUT);

        assertThrows(IllegalArgumentException.class,
                () -> mealLogService.create(ACCOUNT_SEQ, request(UUID.randomUUID().toString(), future)));
    }

    @Test
    void rejectEatenAtOlderThanThirtyDays() {
        String tooOld = OffsetDateTime.now().minusDays(40).format(INPUT);

        assertThrows(IllegalArgumentException.class,
                () -> mealLogService.create(ACCOUNT_SEQ, request(UUID.randomUUID().toString(), tooOld)));
    }

    @Test
    void rejectMissingEatenAtOnCreate() {
        assertThrows(IllegalArgumentException.class,
                () -> mealLogService.create(ACCOUNT_SEQ, request(UUID.randomUUID().toString(), null)));
    }

    @Test
    void rejectEmptyItems() {
        MealLogRequest request = request(UUID.randomUUID().toString(), oneHourAgo());
        request.setItems(List.of());

        assertThrows(IllegalArgumentException.class, () -> mealLogService.create(ACCOUNT_SEQ, request));
    }

    @Test
    void rejectInvalidMealType() {
        MealLogRequest request = request(UUID.randomUUID().toString(), oneHourAgo());
        request.setMealTypeCd("BRUNCH");

        assertThrows(IllegalArgumentException.class, () -> mealLogService.create(ACCOUNT_SEQ, request));
    }

    private static AccountMealLog storedLog(String clientLogId) {
        AccountMealLog log = AccountMealLog.builder()
                .seq(777L)
                .accountSeq(ACCOUNT_SEQ)
                .clientLogId(clientLogId)
                .mealTypeCd(MealType.LUNCH)
                .sourceCd(MealSource.ONDEVICE)
                .eatenAt(OffsetDateTime.now().minusHours(1))
                .totalKcal(new BigDecimal("334"))
                .totalCarbG(new BigDecimal("61.0"))
                .totalProteinG(new BigDecimal("10.6"))
                .totalFatG(new BigDecimal("6.4"))
                .needsReview(true)
                .nutritionVersion(MealLogService.FALLBACK_NUTRITION_VERSION)
                .enabled(true)
                .build();
        log.replaceItems(List.of(AccountMealLogItem.builder()
                .seq(30911L)
                .classKey("gimbap")
                .nameKo("김밥")
                .portionFactor(BigDecimal.ONE)
                .quantity(1)
                .gramsG(new BigDecimal("230.00"))
                .kcal(new BigDecimal("334"))
                .carbG(new BigDecimal("61.0"))
                .proteinG(new BigDecimal("10.6"))
                .fatG(new BigDecimal("6.4"))
                .nutritionSourceCd(NutritionSource.CLASS_FALLBACK)
                .estimated(true)
                .displayOrder(0)
                .build()));
        return log;
    }
}

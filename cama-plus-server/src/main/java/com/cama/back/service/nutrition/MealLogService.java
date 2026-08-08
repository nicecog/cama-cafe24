package com.cama.back.service.nutrition;

import com.cama.back.domain.nutrition.AccountMealFeedback;
import com.cama.back.domain.nutrition.AccountMealLog;
import com.cama.back.domain.nutrition.AccountMealLogItem;
import com.cama.back.domain.nutrition.CmFoodClass;
import com.cama.back.domain.nutrition.CmFoodNutrition;
import com.cama.back.domain.nutrition.MealSource;
import com.cama.back.domain.nutrition.MealType;
import com.cama.back.domain.nutrition.NutritionSource;
import com.cama.back.dto.nutrition.MealClientMeta;
import com.cama.back.dto.nutrition.MealDailySummaryDto;
import com.cama.back.dto.nutrition.MealFeedbackRequest;
import com.cama.back.dto.nutrition.MealLogDto;
import com.cama.back.dto.nutrition.MealLogItemDto;
import com.cama.back.dto.nutrition.MealLogItemRequest;
import com.cama.back.dto.nutrition.MealLogQuery;
import com.cama.back.dto.nutrition.MealLogRequest;
import com.cama.back.dto.nutrition.MealLogSummaryDto;
import com.cama.back.exception.nutrition.FoodClassNotFoundException;
import com.cama.back.exception.nutrition.MealLogNotFoundException;
import com.cama.back.mapper.NutritionMapper;
import com.cama.back.repo.nutrition.FoodClassRepository;
import com.cama.back.repo.nutrition.FoodNutritionRepository;
import com.cama.back.repo.nutrition.MealFeedbackRepository;
import com.cama.back.repo.nutrition.MealLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 식사 기록 계산·저장. 칼로리 정본은 서버가 계산한 값이며 클라이언트 미리보기 값은 저장만 한다.
 */
@Service
@RequiredArgsConstructor
public class MealLogService {

    /** 폴백 영양값만 사용한 기록에 남기는 버전 표기 */
    public static final String FALLBACK_NUTRITION_VERSION = "CLASS_FALLBACK";

    private static final ZoneId KST = ZoneId.of("Asia/Seoul");
    private static final DateTimeFormatter OUTPUT_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
    private static final int MAX_PAST_DAYS = 30;
    private static final Duration FUTURE_TOLERANCE = Duration.ofMinutes(5);
    private static final int DEFAULT_LIST_LIMIT = 100;
    private static final int MAX_LIST_LIMIT = 500;

    private final MealLogRepository mealLogRepository;
    private final FoodClassRepository foodClassRepository;
    private final FoodNutritionRepository foodNutritionRepository;
    private final MealFeedbackRepository mealFeedbackRepository;
    private final NutritionMapper nutritionMapper;
    private final NutritionCalculator calculator;
    private final MealGuideService guideService;
    private final MealLogWriter mealLogWriter;

    /**
     * 저장 없이 정본 영양 DB로 계산만 수행한다. review 화면이 합계를 표시할 때 사용한다.
     */
    @Transactional(readOnly = true)
    public MealLogDto estimate(Long accountSeq, MealLogRequest request) {
        Calculated calculated = calculate(request, false);
        AccountMealLog draft = buildMealLog(accountSeq, request, calculated, null);
        return toDto(draft);
    }

    /**
     * 식사 기록 저장. 동일 clientLogId 재요청은 신규 생성 없이 기존 기록을 돌려준다.
     * <p>
     * 유니크 위반을 잡은 뒤 기존 행을 다시 읽어야 하므로 이 메서드에는 트랜잭션을 걸지 않는다.
     * 삽입만 {@link MealLogWriter} 의 별도 트랜잭션에서 수행한다.
     */
    public MealLogDto create(Long accountSeq, MealLogRequest request) {
        String clientLogId = requireClientLogId(request);
        Calculated calculated = calculate(request, true);
        AccountMealLog mealLog = buildMealLog(accountSeq, request, calculated, clientLogId);

        try {
            return toDto(mealLogWriter.insert(mealLog));
        } catch (DataIntegrityViolationException e) {
            // (account_seq, client_log_id) 유니크 위반 = 이미 저장된 재전송
            return findByClientLogId(accountSeq, clientLogId);
        }
    }

    @Transactional
    public MealLogDto update(Long seq, Long accountSeq, MealLogRequest request) {
        AccountMealLog mealLog = mealLogRepository.findDetailBySeq(seq, accountSeq)
                .orElseThrow(MealLogNotFoundException::new);

        Calculated calculated = calculate(request, false);

        MealType mealType = MealType.from(request.getMealTypeCd());
        if (mealType != null) {
            mealLog.setMealTypeCd(mealType);
        }
        if (StringUtils.hasText(request.getEatenAt())) {
            mealLog.setEatenAt(parseEatenAt(request.getEatenAt()));
        }
        if (request.getMemo() != null) {
            mealLog.setMemo(request.getMemo());
        }
        applyTotals(mealLog, calculated);
        mealLog.replaceItems(calculated.items());

        return toDto(mealLogRepository.save(mealLog));
    }

    @Transactional(readOnly = true)
    public MealLogDto detail(Long seq, Long accountSeq) {
        return toDto(mealLogRepository.findDetailBySeq(seq, accountSeq)
                .orElseThrow(MealLogNotFoundException::new));
    }

    @Transactional
    public boolean delete(Long seq, Long accountSeq) {
        AccountMealLog mealLog = mealLogRepository.findBySeqAndAccountSeqAndEnabled(seq, accountSeq, true)
                .orElseThrow(MealLogNotFoundException::new);
        mealLog.setEnabled(false);
        mealLogRepository.save(mealLog);
        return true;
    }

    public List<MealLogSummaryDto> list(MealLogQuery query) {
        return nutritionMapper.getMealLogList(normalizeQuery(query));
    }

    public List<MealDailySummaryDto> dailySummary(MealLogQuery query) {
        return nutritionMapper.getMealDailySummary(normalizeQuery(query));
    }

    @Transactional
    public Long saveFeedback(Long accountSeq, MealFeedbackRequest request) {
        if (request == null
                || (!StringUtils.hasText(request.getPredictedClass())
                && !StringUtils.hasText(request.getCorrectedClass()))) {
            throw new IllegalArgumentException("predictedClass 또는 correctedClass가 필요합니다.");
        }
        AccountMealFeedback saved = mealFeedbackRepository.save(AccountMealFeedback.builder()
                .accountSeq(accountSeq)
                .mealLogItemSeq(request.getMealLogItemSeq())
                .predictedClass(request.getPredictedClass())
                .correctedClass(request.getCorrectedClass())
                .modelVersion(request.getModelVersion())
                .confidence(request.getConfidence())
                .memo(request.getMemo())
                .build());
        return saved.getSeq();
    }

    /**
     * 조회 쿼리가 items 를 join fetch 하므로 트랜잭션 밖에서 호출해도 안전하다.
     * ({@link #create} 의 재전송 경로가 이에 의존한다)
     */
    @Transactional(readOnly = true)
    public MealLogDto findByClientLogId(Long accountSeq, String clientLogId) {
        return toDto(mealLogRepository.findDetailByClientLogId(accountSeq, clientLogId)
                .orElseThrow(MealLogNotFoundException::new));
    }

    // ---------------------------------------------------------------- 계산

    private Calculated calculate(MealLogRequest request, boolean strictTime) {
        if (request == null) {
            throw new IllegalArgumentException("요청 본문이 비어 있습니다.");
        }
        if (CollectionUtils.isEmpty(request.getItems())) {
            throw new IllegalArgumentException("items가 비어 있습니다.");
        }
        if (request.getItems().size() > NutritionCalculator.MAX_ITEMS) {
            throw new IllegalArgumentException(
                    "items는 최대 " + NutritionCalculator.MAX_ITEMS + "개까지 저장할 수 있습니다.");
        }
        if (strictTime && !StringUtils.hasText(request.getEatenAt())) {
            throw new IllegalArgumentException("eatenAt(섭취 시각)이 필요합니다.");
        }

        Map<String, CmFoodClass> classes = loadFoodClasses(request.getItems());
        NutritionLookup lookup = loadNutrition(classes.values());

        List<AccountMealLogItem> items = new ArrayList<>();
        int order = 0;
        for (MealLogItemRequest itemRequest : request.getItems()) {
            CmFoodClass foodClass = classes.get(normalizeClassKey(itemRequest.getClassKey()));
            CmFoodNutrition nutrition = foodClass.getFoodCode() == null
                    ? null
                    : lookup.byFoodCode().get(foodClass.getFoodCode());
            items.add(calculator.calculateItem(itemRequest, foodClass, nutrition, order++));
        }

        NutritionCalculator.Totals totals = calculator.sum(items);
        return new Calculated(items, totals, resolveNutritionVersion(items, lookup.version()));
    }

    private Map<String, CmFoodClass> loadFoodClasses(List<MealLogItemRequest> items) {
        Set<String> classKeys = new LinkedHashSet<>();
        for (MealLogItemRequest item : items) {
            String classKey = normalizeClassKey(item.getClassKey());
            if (classKey == null) {
                throw new IllegalArgumentException("items[].classKey가 필요합니다.");
            }
            classKeys.add(classKey);
        }

        Map<String, CmFoodClass> found = foodClassRepository
                .findByClassKeyInAndEnabled(classKeys, true)
                .stream()
                .collect(Collectors.toMap(CmFoodClass::getClassKey, Function.identity(), (a, b) -> a));

        for (String classKey : classKeys) {
            if (!found.containsKey(classKey)) {
                throw new FoodClassNotFoundException(classKey);
            }
        }
        return found;
    }

    private NutritionLookup loadNutrition(Collection<CmFoodClass> classes) {
        Set<String> foodCodes = classes.stream()
                .map(CmFoodClass::getFoodCode)
                .filter(StringUtils::hasText)
                .collect(Collectors.toCollection(LinkedHashSet::new));
        if (foodCodes.isEmpty()) {
            return new NutritionLookup(null, Map.of());
        }

        // 식약처(MFDS) D/P코드와 국가표준식품성분(FC10) A코드가 공존하므로
        // 단일 nutrition_version 으로 필터하지 않고 food_code 단위로 조회한다.
        Map<String, CmFoodNutrition> byFoodCode = foodNutritionRepository
                .findEnabledByFoodCodeIn(foodCodes)
                .stream()
                .collect(Collectors.toMap(
                        CmFoodNutrition::getFoodCode,
                        Function.identity(),
                        MealLogService::preferNutritionRow));

        String activeVersion = byFoodCode.values().stream()
                .map(CmFoodNutrition::getNutritionVersion)
                .filter(StringUtils::hasText)
                .collect(Collectors.groupingBy(Function.identity(), Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElseGet(() -> foodNutritionRepository.findLatestVersion().orElse(null));

        return new NutritionLookup(activeVersion, byFoodCode);
    }

    /** 동일 food_code 가 여러 버전에 있으면 식약처 버전을 우선한다. */
    private static CmFoodNutrition preferNutritionRow(CmFoodNutrition a, CmFoodNutrition b) {
        return nutritionVersionRank(a.getNutritionVersion()) >= nutritionVersionRank(b.getNutritionVersion())
                ? a : b;
    }

    private static int nutritionVersionRank(String version) {
        if (version == null) {
            return 0;
        }
        if (version.startsWith("MFDS")) {
            return 2;
        }
        if (version.startsWith("FC10")) {
            return 1;
        }
        return 0;
    }

    private static String resolveNutritionVersion(List<AccountMealLogItem> items, String activeVersion) {
        boolean anyOfficial = items.stream()
                .anyMatch(item -> item.getNutritionSourceCd() == NutritionSource.MFDS);
        return anyOfficial && activeVersion != null ? activeVersion : FALLBACK_NUTRITION_VERSION;
    }

    // ---------------------------------------------------------------- 조립

    private AccountMealLog buildMealLog(Long accountSeq,
                                        MealLogRequest request,
                                        Calculated calculated,
                                        String clientLogId) {
        MealType mealType = MealType.from(request.getMealTypeCd());
        if (mealType == null) {
            throw new IllegalArgumentException(
                    "mealTypeCd는 BREAKFAST, LUNCH, DINNER, SNACK 중 하나여야 합니다.");
        }

        MealSource source = StringUtils.hasText(request.getSourceCd())
                ? MealSource.from(request.getSourceCd())
                : MealSource.ONDEVICE;
        if (source == null) {
            throw new IllegalArgumentException("sourceCd는 ONDEVICE, MANUAL 중 하나여야 합니다.");
        }

        OffsetDateTime eatenAt = StringUtils.hasText(request.getEatenAt())
                ? parseEatenAt(request.getEatenAt())
                : OffsetDateTime.now(KST);

        MealClientMeta meta = request.getClientMeta();

        AccountMealLog mealLog = AccountMealLog.builder()
                .accountSeq(accountSeq)
                .clientLogId(clientLogId)
                .mealTypeCd(mealType)
                .eatenAt(eatenAt)
                .sourceCd(source)
                .memo(request.getMemo())
                .modelVersion(meta == null ? null : meta.getModelVersion())
                .catalogVersion(meta == null ? null : meta.getCatalogVersion())
                .modelProfile(meta == null ? null : meta.getProfile())
                .inferenceMs(meta == null ? null : meta.getInferenceMs())
                .appVersion(meta == null ? null : meta.getAppVersion())
                .enabled(true)
                .build();

        applyTotals(mealLog, calculated);
        mealLog.replaceItems(calculated.items());
        return mealLog;
    }

    private static void applyTotals(AccountMealLog mealLog, Calculated calculated) {
        NutritionCalculator.Totals totals = calculated.totals();
        mealLog.setTotalKcal(totals.kcal());
        mealLog.setTotalCarbG(totals.carbG());
        mealLog.setTotalProteinG(totals.proteinG());
        mealLog.setTotalFatG(totals.fatG());
        mealLog.setNeedsReview(totals.needsReview());
        mealLog.setNutritionVersion(calculated.nutritionVersion());
    }

    private MealLogDto toDto(AccountMealLog mealLog) {
        List<AccountMealLogItem> items = mealLog.getItemsOrEmpty();
        NutritionCalculator.Totals totals = new NutritionCalculator.Totals(
                mealLog.getTotalKcal(),
                mealLog.getTotalCarbG(),
                mealLog.getTotalProteinG(),
                mealLog.getTotalFatG(),
                mealLog.isNeedsReview());

        return MealLogDto.builder()
                .seq(mealLog.getSeq())
                .clientLogId(mealLog.getClientLogId())
                .mealTypeCd(mealLog.getMealTypeCd() == null ? null : mealLog.getMealTypeCd().getValue())
                .eatenAt(formatKst(mealLog.getEatenAt()))
                .sourceCd(mealLog.getSourceCd() == null ? null : mealLog.getSourceCd().getValue())
                .totalKcal(mealLog.getTotalKcal())
                .totalCarbG(mealLog.getTotalCarbG())
                .totalProteinG(mealLog.getTotalProteinG())
                .totalFatG(mealLog.getTotalFatG())
                .needsReview(mealLog.isNeedsReview())
                .nutritionVersion(mealLog.getNutritionVersion())
                .memo(mealLog.getMemo())
                .items(items.stream().map(MealLogService::toItemDto).toList())
                .guide(guideService.build(mealLog.getMealTypeCd(), totals, items))
                .build();
    }

    private static MealLogItemDto toItemDto(AccountMealLogItem item) {
        return MealLogItemDto.builder()
                .seq(item.getSeq())
                .classKey(item.getClassKey())
                .nameKo(item.getNameKo())
                .foodCode(item.getFoodCode())
                .confidence(item.getConfidence())
                .portionFactor(item.getPortionFactor())
                .quantity(item.getQuantity())
                .gramsG(item.getGramsG())
                .kcal(item.getKcal())
                .carbG(item.getCarbG())
                .proteinG(item.getProteinG())
                .fatG(item.getFatG())
                .nutritionSourceCd(item.getNutritionSourceCd() == null
                        ? null
                        : item.getNutritionSourceCd().getValue())
                .estimated(item.isEstimated())
                .userCorrected(item.isUserCorrected())
                .originalClassKey(item.getOriginalClassKey())
                .displayOrder(item.getDisplayOrder())
                .build();
    }

    // ---------------------------------------------------------------- 검증 유틸

    private static String requireClientLogId(MealLogRequest request) {
        if (request == null || !StringUtils.hasText(request.getClientLogId())) {
            throw new IllegalArgumentException("clientLogId가 필요합니다.");
        }
        String value = request.getClientLogId().trim();
        try {
            return UUID.fromString(value).toString();
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("clientLogId는 UUID 형식이어야 합니다.");
        }
    }

    private static String normalizeClassKey(String classKey) {
        return StringUtils.hasText(classKey) ? classKey.trim() : null;
    }

    static OffsetDateTime parseEatenAt(String value) {
        OffsetDateTime parsed = parseFlexible(value);
        OffsetDateTime now = OffsetDateTime.now(KST);
        if (parsed.isAfter(now.plus(FUTURE_TOLERANCE))) {
            throw new IllegalArgumentException("eatenAt은 미래 시각일 수 없습니다.");
        }
        if (parsed.isBefore(now.minusDays(MAX_PAST_DAYS))) {
            throw new IllegalArgumentException("eatenAt은 최근 " + MAX_PAST_DAYS + "일 이내여야 합니다.");
        }
        return parsed;
    }

    private static OffsetDateTime parseFlexible(String value) {
        String trimmed = value.trim();
        try {
            return OffsetDateTime.parse(trimmed);
        } catch (DateTimeParseException ignored) {
            // 오프셋이 없는 형식은 Asia/Seoul 로 해석한다
        }
        try {
            return LocalDateTime.parse(trimmed.replace(' ', 'T')).atZone(KST).toOffsetDateTime();
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException(
                    "eatenAt 형식이 올바르지 않습니다. ISO-8601 또는 yyyy-MM-dd HH:mm:ss 를 사용하세요.");
        }
    }

    private static String formatKst(OffsetDateTime value) {
        return value == null ? null : value.atZoneSameInstant(KST).format(OUTPUT_FORMAT);
    }

    private static MealLogQuery normalizeQuery(MealLogQuery query) {
        if (query == null || query.getAccountSeq() == null) {
            throw new IllegalArgumentException("accountSeq가 필요합니다.");
        }
        if (query.getLimit() == null || query.getLimit() <= 0) {
            query.setLimit(DEFAULT_LIST_LIMIT);
        }
        if (query.getLimit() > MAX_LIST_LIMIT) {
            query.setLimit(MAX_LIST_LIMIT);
        }
        if (StringUtils.hasText(query.getMealTypeCd())) {
            MealType mealType = MealType.from(query.getMealTypeCd());
            if (mealType == null) {
                throw new IllegalArgumentException(
                        "mealTypeCd는 BREAKFAST, LUNCH, DINNER, SNACK 중 하나여야 합니다.");
            }
            query.setMealTypeCd(mealType.getValue());
        }
        return query;
    }

    private record Calculated(List<AccountMealLogItem> items,
                              NutritionCalculator.Totals totals,
                              String nutritionVersion) {
    }

    private record NutritionLookup(String version, Map<String, CmFoodNutrition> byFoodCode) {
    }
}

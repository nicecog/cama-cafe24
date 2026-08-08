package com.cama.back.domain.nutrition;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;

/**
 * 식사 항목. 영양값은 계산 시점 스냅샷이며 영양 DB 갱신 후에도 변경하지 않는다.
 */
@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "seq")
public class AccountMealLogItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meal_log_seq")
    private AccountMealLog mealLog;

    @Column(name = "class_key")
    private String classKey;

    @Column(name = "name_ko")
    private String nameKo;

    @Column(name = "food_code")
    private String foodCode;

    private BigDecimal confidence;

    private BigDecimal portionFactor;

    private Integer quantity;

    /** servingG x portionFactor x quantity */
    @Column(name = "grams_g")
    private BigDecimal gramsG;

    private BigDecimal kcal;

    @Column(name = "carb_g")
    private BigDecimal carbG;

    @Column(name = "protein_g")
    private BigDecimal proteinG;

    @Column(name = "fat_g")
    private BigDecimal fatG;

    @Enumerated(EnumType.STRING)
    @Column(name = "nutrition_source_cd")
    private NutritionSource nutritionSourceCd;

    @Column(name = "is_estimated")
    private boolean estimated;

    @Column(name = "is_user_corrected")
    private boolean userCorrected;

    @Column(name = "original_class_key")
    private String originalClassKey;

    /** 앱 미리보기 kcal. 계산에 사용하지 않고 드리프트 모니터링용으로만 보관한다 */
    @Column(name = "client_kcal_preview")
    private BigDecimal clientKcalPreview;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Double> bbox;

    @Column(name = "display_order")
    private Integer displayOrder;

    @Column(name = "created_at", updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private OffsetDateTime createdAt;
}

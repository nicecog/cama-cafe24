package com.cama.back.domain.nutrition;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 식사 기록 헤더. 합계는 서버가 정본 영양 DB로 재계산한 값만 저장한다.
 */
@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "seq")
public class AccountMealLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @Column(name = "account_seq")
    private Long accountSeq;

    /** 클라이언트 생성 UUID. (accountSeq, clientLogId) 유니크로 재전송을 흡수한다 */
    @Column(name = "client_log_id")
    private String clientLogId;

    @Enumerated(EnumType.STRING)
    @Column(name = "meal_type_cd")
    private MealType mealTypeCd;

    @Column(name = "eaten_at")
    private OffsetDateTime eatenAt;

    @Enumerated(EnumType.STRING)
    @Column(name = "source_cd")
    private MealSource sourceCd;

    @Column(name = "total_kcal")
    private BigDecimal totalKcal;

    @Column(name = "total_carb_g")
    private BigDecimal totalCarbG;

    @Column(name = "total_protein_g")
    private BigDecimal totalProteinG;

    @Column(name = "total_fat_g")
    private BigDecimal totalFatG;

    @Column(name = "needs_review")
    private boolean needsReview;

    @Column(name = "nutrition_version")
    private String nutritionVersion;

    @Column(name = "model_version")
    private String modelVersion;

    @Column(name = "catalog_version")
    private String catalogVersion;

    @Column(name = "model_profile")
    private String modelProfile;

    @Column(name = "inference_ms")
    private Integer inferenceMs;

    @Column(name = "app_version")
    private String appVersion;

    private String memo;

    @JsonIgnore
    @Column(name = "is_enabled")
    private boolean enabled;

    @OneToMany(mappedBy = "mealLog", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("displayOrder asc, seq asc")
    private List<AccountMealLogItem> items;

    @Column(name = "created_at", updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private OffsetDateTime updatedAt;

    public void replaceItems(List<AccountMealLogItem> newItems) {
        if (items == null) {
            items = new ArrayList<>();
        }
        items.clear();
        if (newItems == null) {
            return;
        }
        for (AccountMealLogItem item : newItems) {
            item.setMealLog(this);
            items.add(item);
        }
    }

    public List<AccountMealLogItem> getItemsOrEmpty() {
        return items == null ? List.of() : items;
    }
}

package com.cama.back.domain.nutrition;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.OffsetDateTime;

/**
 * 온디바이스 탐지 클래스 마스터. classId 는 모델 출력 인덱스와 일치해야 한다.
 */
@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "seq")
public class CmFoodClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @Column(name = "class_id")
    private Integer classId;

    @Column(name = "class_key")
    private String classKey;

    @Column(name = "name_ko")
    private String nameKo;

    @Column(name = "category_nm")
    private String categoryNm;

    /** 식약처 식품코드. null 이면 폴백 영양값을 사용한다 */
    @Column(name = "food_code")
    private String foodCode;

    /** 표준 1인분 중량(g) */
    @Column(name = "serving_g")
    private BigDecimal servingG;

    @Column(name = "priority_cd")
    private String priorityCd;

    @Column(name = "fb_kcal")
    private BigDecimal fbKcal;

    @Column(name = "fb_carb_g")
    private BigDecimal fbCarbG;

    @Column(name = "fb_protein_g")
    private BigDecimal fbProteinG;

    @Column(name = "fb_fat_g")
    private BigDecimal fbFatG;

    @JsonIgnore
    @Column(name = "is_enabled")
    private boolean enabled;

    @Column(name = "created_at", updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private OffsetDateTime updatedAt;

    public boolean hasFallbackNutrition() {
        return fbKcal != null;
    }
}

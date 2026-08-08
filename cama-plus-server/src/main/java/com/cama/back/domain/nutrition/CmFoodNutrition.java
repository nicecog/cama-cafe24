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
 * 식약처 식품영양성분 DB (100g 기준). 버전별로 행이 누적된다.
 */
@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "seq")
public class CmFoodNutrition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @Column(name = "food_code")
    private String foodCode;

    @Column(name = "food_name")
    private String foodName;

    /** 예: MFDS-2026.1 */
    @Column(name = "nutrition_version")
    private String nutritionVersion;

    private BigDecimal kcal;

    @Column(name = "carb_g")
    private BigDecimal carbG;

    @Column(name = "protein_g")
    private BigDecimal proteinG;

    @Column(name = "fat_g")
    private BigDecimal fatG;

    @Column(name = "sugar_g")
    private BigDecimal sugarG;

    @Column(name = "sodium_mg")
    private BigDecimal sodiumMg;

    @JsonIgnore
    @Column(name = "is_enabled")
    private boolean enabled;

    @Column(name = "created_at", updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private OffsetDateTime createdAt;
}

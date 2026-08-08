package com.cama.back.domain.nutrition;

import com.fasterxml.jackson.annotation.JsonFormat;
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
 * 음식 오분류 피드백. 재학습 클래스 우선순위 산정에 사용한다.
 */
@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "seq")
public class AccountMealFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    @Column(name = "account_seq")
    private Long accountSeq;

    @Column(name = "meal_log_item_seq")
    private Long mealLogItemSeq;

    @Column(name = "predicted_class")
    private String predictedClass;

    @Column(name = "corrected_class")
    private String correctedClass;

    @Column(name = "model_version")
    private String modelVersion;

    private BigDecimal confidence;

    private String memo;

    @Column(name = "created_at", updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private OffsetDateTime createdAt;
}

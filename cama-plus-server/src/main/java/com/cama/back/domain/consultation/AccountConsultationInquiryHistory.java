package com.cama.back.domain.consultation;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "seq")
@Table(name = "account_consultation_inquiry_history")
public class AccountConsultationInquiryHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;

    private Long inquirySeq;

    private Long accountSeq;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private ConsultationInquiryActionType actionType;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "text")
    private String content;

    @Column(name = "is_transmitted")
    private boolean transmitted;

    @Column(updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;
}

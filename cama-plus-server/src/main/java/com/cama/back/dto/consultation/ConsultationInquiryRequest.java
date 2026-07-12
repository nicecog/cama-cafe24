package com.cama.back.dto.consultation;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConsultationInquiryRequest {

    private Long acSeq;
    private String title;
    private String content;
}

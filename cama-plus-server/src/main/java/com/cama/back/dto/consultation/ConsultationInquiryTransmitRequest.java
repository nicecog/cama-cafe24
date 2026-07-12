package com.cama.back.dto.consultation;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ConsultationInquiryTransmitRequest {

    private Long acSeq;
    private List<Long> seqs;
}

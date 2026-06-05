package com.cama.back.domain.iamport;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class IptPaymentCancelDetail {

    private String pgTid;

    private BigDecimal amount;

    private long cancelledAt;

    private String reason;

    private String receiptUrl;

}

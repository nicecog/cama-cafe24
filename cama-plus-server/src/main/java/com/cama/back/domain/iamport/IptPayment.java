package com.cama.back.domain.iamport;


import com.google.gson.annotations.SerializedName;
import lombok.Getter;
import lombok.Setter;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.math.BigDecimal;

@Getter
@Setter
public class IptPayment {

    @SerializedName("imp_uid")
    String impUid;

    @SerializedName("merchant_uid")
    String merchantUid;

    @SerializedName("pay_method")
    String payMethod;

    @SerializedName("pg_provider")
    String pgProvider;

    @SerializedName("pg_tid")
    String pgTid;

    @SerializedName("escrow")
    boolean escrow;

    @SerializedName("apply_num")
    String applyNum;

    @SerializedName("bank_code")
    String bankCode;

    @SerializedName("bank_name")
    String bankName;

    @SerializedName("card_code")
    String cardCode;

    @SerializedName("card_name")
    String cardName;

    @SerializedName("card_quota")
    int cardQuota;

    @SerializedName("vbank_code")
    String vbankCode;

    @SerializedName("vbank_name")
    String vbankName;

    @SerializedName("vbank_num")
    String vbankNum;

    @SerializedName("vbank_holder")
    String vbankHolder;

    @SerializedName("vbank_date")
    long vbankDate;

    @SerializedName("name")
    String name;

    @SerializedName("amount")
    BigDecimal amount;

    @SerializedName("cancel_amount")
    BigDecimal cancelAmount;

    @SerializedName("buyer_name")
    String buyerName;

    @SerializedName("buyer_email")
    String buyerEmail;

    @SerializedName("buyer_tel")
    String buyerTel;

    @SerializedName("buyer_addr")
    String buyerAddr;

    @SerializedName("buyer_postcode")
    String buyerPostcode;

    @SerializedName("custom_data")
    String customData;

    @SerializedName("status")
    String status;

    @SerializedName("paid_at")
    long paidAt;

    @SerializedName("failed_at")
    long failedAt;

    @SerializedName("cancelled_at")
    long cancelledAt;

    @SerializedName("fail_reason")
    String failReason;

    @SerializedName("cancel_reason")
    String cancelReason;

    @SerializedName("receipt_url")
    String receiptUrl;

    @SerializedName("cancel_history")
    IptPaymentCancelDetail[] cancelHistory;

    @SerializedName("cash_receipt_issued")
    boolean cashReceiptIssued;

    @Override
    public String toString() {
        return ReflectionToStringBuilder.toString(this, ToStringStyle.JSON_STYLE);
    }

}

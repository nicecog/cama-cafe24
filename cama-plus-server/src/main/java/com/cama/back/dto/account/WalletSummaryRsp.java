package com.cama.back.dto.account;

import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WalletSummaryRsp {

    private String address;

    // 폴리곤 메틱
    private double matic;

    // 디캅 폴리곤
    private double polygon;

    // 이더리움
    private double ether;

    // 디캅 이더
    private double decopEther;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

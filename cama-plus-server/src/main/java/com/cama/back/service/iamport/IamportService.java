package com.cama.back.service.iamport;


import com.cama.back.domain.iamport.IamportResponseCertification;
import com.cama.back.domain.iamport.IptCancel;
import com.cama.back.domain.iamport.IptPayment;

import java.math.BigDecimal;

public interface IamportService {

    IamportResponseCertification checkCertification(String impUid);

    String iamportAccessToken();

    IptPayment payment(String impUid);

    IptCancel paymentCancel(String impUid, BigDecimal amount, boolean isTotal, String msg);


}

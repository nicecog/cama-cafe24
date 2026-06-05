package com.cama.back.service.iamport;


import com.cama.back.AppContext;
import com.cama.back.domain.iamport.*;
import com.cama.back.exception.iamport.IamportException;
import com.cama.back.exception.iamport.IamportResponseException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;

@Service
public class IamportServiceImpl implements IamportService {

    @Value("${iamport.key}")
    private String iamportKey;

    @Value("${iamport.secure}")
    private String iamportSecure;

    private final RestTemplate restTemplate;

    public IamportServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public IamportResponseCertification checkCertification(String impUid) {

        String iamportGetTokenUrl = "https://api.iamport.kr/users/getToken";

        Map<String, Object> params = new HashMap<>();
        params.put("imp_key", iamportKey);
        params.put("imp_secret", iamportSecure);

        String body = AppContext.GSON.toJson(params);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        HttpEntity<String> entity = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(iamportGetTokenUrl, entity, String.class);

        IamportResponse call = AppContext.GSONC.fromJson(response.getBody(), IamportResponse.class);

        String accessToken = call.getResponse().getAccessToken();

        String iamportUrl = "https://api.iamport.kr/certifications/" + impUid;

        HttpHeaders headers2 = new HttpHeaders();
        headers2.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers2.add("Authorization", accessToken);

        HttpEntity<String> request = new HttpEntity<>(headers2);

        try {
            ResponseEntity<String> s = restTemplate.exchange(iamportUrl, HttpMethod.GET, request, String.class);
            return AppContext.GSON.fromJson(s.getBody(), IamportResponseCertification.class);
        } catch (HttpClientErrorException e) {
            throw new IamportResponseException(e.getMessage());
        }

    }

    @Override
    public String iamportAccessToken() {

        String TOKEN_URL = "https://api.iamport.kr/users/getToken";

        Map<String, Object> params = new HashMap<>();

        params.put("imp_key", iamportKey);
        params.put("imp_secret", iamportSecure);

        String body = AppContext.GSON.toJson(params);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        HttpEntity entity = new HttpEntity<>(body, headers);
        ResponseEntity response = restTemplate.postForEntity(TOKEN_URL, entity, String.class);

        if (response.getBody() != null) {
            IamportResponse call = AppContext.GSONC.fromJson(response.getBody().toString(), IamportResponse.class);
            return call.getResponse().getAccessToken();
        } else {
            throw new IamportException();
        }

    }

    @Override
    public IptPayment payment(String impUid) {

        String iamportUrl = "https://api.iamport.kr/payments/" + impUid;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.add("Authorization", iamportAccessToken());

        HttpEntity<String> request = new HttpEntity<>(headers);
        ResponseEntity s;
        try {
            s = restTemplate.exchange(iamportUrl, HttpMethod.GET, request, String.class);
        } catch (Exception e) {
            return IamportRsp.builder().response(null).build().getResponse();
        }

        return AppContext.GSON.fromJson(s.getBody().toString(), IamportRsp.class).getResponse();
    }

    @Override
    public IptCancel paymentCancel(String impUid, BigDecimal amount, boolean isTotal, String msg) {

        String iamportUrl = "https://api.iamport.kr/payments/cancel";

        Map<String, Object> params = new HashMap<>();

        params.put("imp_uid", impUid);

        if (!isTotal) {
            params.put("amount", amount);
        }

        params.put("reason", msg);

        String body = AppContext.GSON.toJson(params);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(new MediaType("application", "json", StandardCharsets.UTF_8));
        headers.add("Authorization", iamportAccessToken());

        HttpEntity entity = new HttpEntity<>(body, headers);
        ResponseEntity response = restTemplate.postForEntity(iamportUrl, entity, String.class);

        return AppContext.GSON.fromJson(response.getBody().toString(), IptCancel.class);

    }

}

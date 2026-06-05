package com.cama.back.service.email;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@ConditionalOnProperty(name = "cama.mail.enabled", havingValue = "true")
@ConditionalOnProperty(name = "cama.mail.provider", havingValue = "brevo-api")
public class BrevoApiEmailService implements EmailService {

    private static final String SEND_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String fromAddress;
    private final String senderName;

    public BrevoApiEmailService(
            RestTemplate restTemplate,
            @Value("${cama.mail.brevo-api-key}") String apiKey,
            @Value("${cama.mail.from:noreply@camaplus.com}") String fromAddress,
            @Value("${cama.mail.sender-name:CAMA Plus}") String senderName) {
        this.restTemplate = restTemplate;
        this.apiKey = apiKey;
        this.fromAddress = fromAddress;
        this.senderName = senderName;
    }

    @Override
    public void sendPlainText(String to, String subject, String body) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        Map<String, Object> sender = new LinkedHashMap<>();
        sender.put("name", senderName);
        sender.put("email", fromAddress);

        Map<String, Object> recipient = new LinkedHashMap<>();
        recipient.put("email", to);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("sender", sender);
        payload.put("to", List.of(recipient));
        payload.put("subject", subject);
        payload.put("textContent", body);

        restTemplate.postForEntity(SEND_URL, new HttpEntity<>(payload, headers), Void.class);
    }
}

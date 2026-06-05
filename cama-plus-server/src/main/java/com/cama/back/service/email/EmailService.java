package com.cama.back.service.email;

public interface EmailService {

    void sendPlainText(String to, String subject, String body);
}

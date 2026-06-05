package com.cama.back.service.email;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "cama.mail.enabled", havingValue = "false", matchIfMissing = true)
public class LoggingEmailService implements EmailService {

    private static final Logger log = LoggerFactory.getLogger(LoggingEmailService.class);

    @Override
    public void sendPlainText(String to, String subject, String body) {
        log.info("[cama-mail:local] to={} subject={}\n{}", to, subject, body);
    }
}

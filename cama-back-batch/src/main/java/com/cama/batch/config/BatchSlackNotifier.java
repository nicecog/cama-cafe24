package com.cama.batch.config;

import net.gpedro.integrations.slack.SlackApi;
import net.gpedro.integrations.slack.SlackMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Component
public class BatchSlackNotifier {

    private static final Logger logger = LoggerFactory.getLogger(BatchSlackNotifier.class);

    private final BatchProperties batchProperties;

    public BatchSlackNotifier(BatchProperties batchProperties) {
        this.batchProperties = batchProperties;
    }

    public void notify(String message) {
        if (!batchProperties.getSlack().isEnabled()) {
            logger.debug("Slack disabled (local): {}", message);
            return;
        }
        String webhook = batchProperties.getSlack().getWebhookUrl();
        if (webhook == null || webhook.isBlank()) {
            logger.debug("Slack webhook not configured: {}", message);
            return;
        }
        try {
            new SlackApi(webhook).call(new SlackMessage(message));
        } catch (Exception e) {
            logger.warn("Slack notify failed: {}", e.getMessage());
        }
    }
}

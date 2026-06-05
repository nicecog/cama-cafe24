package com.cama.batch.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Component
@ConfigurationProperties(prefix = "cama.batch")
public class BatchProperties {

    private final Slack slack = new Slack();
    private final Fcm fcm = new Fcm();

    public Slack getSlack() {
        return slack;
    }

    public Fcm getFcm() {
        return fcm;
    }

    public static class Slack {
        private boolean enabled = true;
        private String webhookUrl = "";

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getWebhookUrl() {
            return webhookUrl;
        }

        public void setWebhookUrl(String webhookUrl) {
            this.webhookUrl = webhookUrl;
        }
    }

    public static class Fcm {
        private boolean dryRun = false;

        public boolean isDryRun() {
            return dryRun;
        }

        public void setDryRun(boolean dryRun) {
            this.dryRun = dryRun;
        }
    }
}

package com.cama.batch.messaging;

import com.cama.batch.config.BatchProperties;
import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.ApnsConfig;
import com.google.firebase.messaging.Aps;
import com.google.firebase.messaging.ApsAlert;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.Notification;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.concurrent.ExecutionException;

@Component
public class FcmMessageSender {

    public static final String ANDROID_CHANNEL_ID = "cama-plus-notification";

    private static final Logger logger = LoggerFactory.getLogger(FcmMessageSender.class);

    private final BatchProperties batchProperties;

    public FcmMessageSender(BatchProperties batchProperties) {
        this.batchProperties = batchProperties;
    }

    public String send(String dataType, String dataTitle, String dataMessage, String firebaseToken) {
        if (batchProperties.getFcm().isDryRun()) {
            logger.info("FCM dry-run type={} token={} title={}", dataType, maskToken(firebaseToken), dataTitle);
            return "dry-run";
        }

        Message msg = Message.builder()
                .setToken(firebaseToken)
                .setNotification(Notification.builder()
                        .setTitle(dataTitle)
                        .setBody(dataMessage)
                        .build())
                .putData("type", dataType)
                .putData("title", dataTitle)
                .putData("body", dataMessage)
                .setAndroidConfig(AndroidConfig.builder()
                        .setPriority(AndroidConfig.Priority.HIGH)
                        .setNotification(AndroidNotification.builder()
                                .setChannelId(ANDROID_CHANNEL_ID)
                                .build())
                        .build())
                .setApnsConfig(ApnsConfig.builder()
                        .putHeader("apns-priority", "10")
                        .setAps(Aps.builder()
                                .setSound("default")
                                .setAlert(ApsAlert.builder()
                                        .setTitle(dataTitle)
                                        .setBody(dataMessage)
                                        .build())
                                .build())
                        .build())
                .build();

        try {
            String response = FirebaseMessaging.getInstance().sendAsync(msg).get();
            logger.debug("FCM sent type={} response={}", dataType, response);
            return response;
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.warn("FCM send interrupted type={}", dataType);
            return null;
        } catch (ExecutionException e) {
            Throwable cause = e.getCause();
            if (cause instanceof FirebaseMessagingException) {
                logFcmFailure(dataType, firebaseToken, (FirebaseMessagingException) cause);
            } else {
                logger.warn("FCM send failed type={}: {}", dataType,
                        cause != null ? cause.getMessage() : e.getMessage());
            }
            return null;
        }
    }

    private static void logFcmFailure(String dataType, String token, FirebaseMessagingException e) {
        MessagingErrorCode code = e.getMessagingErrorCode();
        logger.warn("FCM send failed type={} code={} token={}: {}", dataType, code, maskToken(token), e.getMessage());
    }

    private static String maskToken(String token) {
        if (token == null || token.length() <= 8) {
            return "(empty)";
        }
        return token.substring(0, 8) + "...";
    }
}

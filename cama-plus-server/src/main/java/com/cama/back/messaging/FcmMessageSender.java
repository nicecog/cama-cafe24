package com.cama.back.messaging;

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

import java.util.concurrent.ExecutionException;

/**
 * FCM HTTP v1 (Firebase Admin SDK) — notification + data, Android channel, APNs alert.
 */
public final class FcmMessageSender {

    public static final String ANDROID_CHANNEL_ID = "cama-plus-notification";

    private static final Logger logger = LoggerFactory.getLogger(FcmMessageSender.class);

    private FcmMessageSender() {
    }

    public static String send(String dataType, String dataTitle, String dataMessage, String firebaseToken) {
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
            if (cause instanceof FirebaseMessagingException fme) {
                logFcmFailure(dataType, firebaseToken, fme);
            } else {
                logger.warn("FCM send failed type={}: {}", dataType, cause != null ? cause.getMessage() : e.getMessage());
            }
            return null;
        }
    }

    private static void logFcmFailure(String dataType, String token, FirebaseMessagingException e) {
        MessagingErrorCode code = e.getMessagingErrorCode();
        String tokenHint = token != null && token.length() > 8
                ? token.substring(0, 8) + "..."
                : "(empty)";
        if (code == MessagingErrorCode.UNREGISTERED || code == MessagingErrorCode.INVALID_ARGUMENT) {
            logger.warn("FCM token invalid type={} code={} token={}", dataType, code, tokenHint);
        } else {
            logger.warn("FCM send failed type={} code={} token={}: {}", dataType, code, tokenHint, e.getMessage());
        }
    }
}

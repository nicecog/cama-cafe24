package com.cama.back.service.notification;

import com.cama.back.domain.account.Account;
import com.cama.back.domain.firebase.FirebaseToken;
import com.cama.back.dto.monitor.AdminNotificationSendRequest;
import com.cama.back.dto.monitor.AdminNotificationSendResult;
import com.cama.back.dto.monitor.FcmTestModeStatusRsp;
import com.cama.back.mapper.FcmTestModeMapper;
import com.cama.back.mapper.FcmTestModeRow;
import com.cama.back.messaging.FcmMessageSender;
import com.cama.back.repo.account.AccountRepository;
import com.cama.back.repo.firebase.FirebaseTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class FcmTestModeServiceImpl implements FcmTestModeService {

    private static final Logger logger = LoggerFactory.getLogger(FcmTestModeServiceImpl.class);
    private static final String ADMIN_MSG_TYPE = "ADMIN_001";

    private final FcmTestModeMapper fcmTestModeMapper;
    private final FirebaseTokenRepository firebaseTokenRepository;
    private final AccountRepository accountRepository;

    public FcmTestModeServiceImpl(FcmTestModeMapper fcmTestModeMapper,
                                  FirebaseTokenRepository firebaseTokenRepository,
                                  AccountRepository accountRepository) {
        this.fcmTestModeMapper = fcmTestModeMapper;
        this.firebaseTokenRepository = firebaseTokenRepository;
        this.accountRepository = accountRepository;
    }

    @Override
    public FcmTestModeStatusRsp getStatus() {
        ensureTables();
        FcmTestModeRow row = fcmTestModeMapper.findActiveTestMode();
        if (row == null) {
            return FcmTestModeStatusRsp.builder()
                    .active(false)
                    .backedUpScheduleCount(0)
                    .build();
        }
        return FcmTestModeStatusRsp.builder()
                .active(true)
                .sessionId(row.getSessionId())
                .backedUpScheduleCount(row.getBackedUpCount())
                .preparedAt(row.getPreparedAt())
                .build();
    }

    @Override
    @Transactional
    public FcmTestModeStatusRsp prepareTestMode() {
        ensureTables();
        if (fcmTestModeMapper.countActiveBackupSession() > 0) {
            return getStatus();
        }

        String sessionId = UUID.randomUUID().toString().replace("-", "");
        int backedUp = fcmTestModeMapper.backupEnabledBatchSchedules(sessionId);
        fcmTestModeMapper.disableEnabledBatchSchedules();
        fcmTestModeMapper.insertTestModeSession(sessionId, backedUp);

        logger.info("FCM test mode prepared session={} backedUp={}", sessionId, backedUp);
        return getStatus();
    }

    @Override
    @Transactional
    public FcmTestModeStatusRsp restoreTestMode() {
        ensureTables();
        String sessionId = fcmTestModeMapper.findActiveSessionId();
        if (sessionId == null) {
            return getStatus();
        }

        fcmTestModeMapper.restoreBatchSchedules(sessionId);
        fcmTestModeMapper.deleteBackupSession(sessionId);
        fcmTestModeMapper.deleteTestModeSession(sessionId);

        logger.info("FCM test mode restored session={}", sessionId);
        return getStatus();
    }

    @Override
    @Transactional
    public AdminNotificationSendResult sendAdminNotification(AdminNotificationSendRequest request) {
        if (request.getAccountSeqs() == null || request.getAccountSeqs().isEmpty()) {
            throw new IllegalArgumentException("전송 대상 환자를 선택해 주세요.");
        }
        if (!StringUtils.hasText(request.getMessage())) {
            throw new IllegalArgumentException("메시지 내용을 입력해 주세요.");
        }

        FcmTestModeStatusRsp status = prepareTestMode();

        String title = buildTitle(request);
        String body = request.getMessage().trim();

        List<AdminNotificationSendResult.AdminNotificationSendItem> items = new ArrayList<>();
        int sent = 0;
        int failed = 0;
        int skipped = 0;

        for (Long accountSeq : request.getAccountSeqs()) {
            String name = accountRepository.findById(accountSeq)
                    .map(Account::getName)
                    .orElse("");

            var tokenOpt = firebaseTokenRepository.findBestDeliverableToken(accountSeq);
            if (tokenOpt.isEmpty() || !isValidToken(tokenOpt.get())) {
                skipped++;
                items.add(AdminNotificationSendResult.AdminNotificationSendItem.builder()
                        .accountSeq(accountSeq)
                        .name(name)
                        .success(false)
                        .detail("FCM 토큰 없음")
                        .build());
                continue;
            }

            String token = tokenOpt.get().getToken();
            String response = FcmMessageSender.send(ADMIN_MSG_TYPE, title, body, token);
            boolean success = response != null && !response.isBlank();
            if (success) {
                sent++;
            } else {
                failed++;
            }
            items.add(AdminNotificationSendResult.AdminNotificationSendItem.builder()
                    .accountSeq(accountSeq)
                    .name(name)
                    .success(success)
                    .detail(success ? "전송 완료" : "FCM 전송 실패")
                    .build());
        }

        logger.info("Admin FCM send sent={} failed={} skipped={}", sent, failed, skipped);

        return AdminNotificationSendResult.builder()
                .testModePrepared(status.isActive())
                .backedUpScheduleCount(status.getBackedUpScheduleCount())
                .sentCount(sent)
                .failedCount(failed)
                .skippedNoTokenCount(skipped)
                .items(items)
                .build();
    }

    private String buildTitle(AdminNotificationSendRequest request) {
        if (StringUtils.hasText(request.getSendDate()) && StringUtils.hasText(request.getSendTime())) {
            return "CAMA 알림 (" + request.getSendDate() + " " + request.getSendTime() + ")";
        }
        return "CAMA 알림";
    }

    private boolean isValidToken(FirebaseToken fb) {
        String token = fb.getToken();
        return token != null
                && !token.isBlank()
                && !"test".equals(token)
                && !"web-no-fcm".equals(token)
                && token.length() > 10;
    }

    private void ensureTables() {
        fcmTestModeMapper.ensureBackupTable();
        fcmTestModeMapper.ensureTestModeTable();
    }
}

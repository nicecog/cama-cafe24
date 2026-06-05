package com.cama.back.service.notification;


import com.cama.back.domain.common.PushInfo;
import com.cama.back.domain.firebase.FirebaseToken;
import com.cama.back.messaging.FcmMessageSender;
import com.cama.back.repo.firebase.FirebaseTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationServiceImpl.class);

    private final FirebaseTokenRepository firebaseTokenRepository;

    public NotificationServiceImpl(FirebaseTokenRepository firebaseTokenRepository) {
        this.firebaseTokenRepository = firebaseTokenRepository;
    }

    @Override
    public void qnaAnswerNotification(Long targetSeq) {
        firebaseNotiPush(PushInfo.builder()
                .pushTargetSeq(targetSeq)
                .msgType("DECOP_001")
                .title("1:1 문의 내역 답변이 등록 되었습니다.")
                .message("앱에서 확인해 주세요.")
                .build());
    }

    @Override
    public void noticeNotification(java.util.List<Long> targetList) {

        for (Long target : targetList) {
            firebaseNotiPush(PushInfo.builder()
                    .pushTargetSeq(target)
                    .msgType("DECOP_002")
                    .title("공지사항이 등록 되었습니다.")
                    .message("앱에서 확인해 주세요.")
                    .build());
        }

    }

    @Override
    public void pushTest(String token) {

        String type = "TEST_001";
        String title = "테스트 타이틀";
        String message = "테스트 본문";

        FcmMessageSender.send(type, title, message, token);

    }

    private void firebaseNotiPush(PushInfo pushInfo) {

        firebaseTokenRepository.findByAccountSeqAndEnabled(pushInfo.getPushTargetSeq(), true)
                .ifPresent(fb -> sendIfTokenPresent(
                        pushInfo.getMsgType(),
                        pushInfo.getTitle(),
                        pushInfo.getMessage(),
                        fb));
    }

    private void sendIfTokenPresent(String type, String title, String message, FirebaseToken fb) {
        if (fb.getToken() != null && !fb.getToken().isEmpty()) {
            String response = FcmMessageSender.send(type, title, message, fb.getToken());
            logger.info("FCM response: {}", response);
        }
    }

}

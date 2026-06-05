package com.cama.back.service.notification;


import java.util.List;

public interface NotificationService {

    void qnaAnswerNotification(Long targetSeq);

    void noticeNotification(List<Long> targetList);

    void pushTest(String token);

}

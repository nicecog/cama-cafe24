package com.cama.batch.service.notification;


import com.cama.batch.dto.batch.BatchRsp;
import com.cama.batch.messaging.FcmMessageSender;
import org.springframework.stereotype.Service;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final FcmMessageSender fcmMessageSender;

    public NotificationServiceImpl(FcmMessageSender fcmMessageSender) {
        this.fcmMessageSender = fcmMessageSender;
    }

    @Override
    public void scheduleNotification(BatchRsp dto) {
        sendSchedule(dto, "SCH_003",
                "예약한 일정이 있습니다.(" + dto.getStartDate() + " " + dto.getTime() + ")",
                "앱에서 일정을 확인해주세요.");
    }

    @Override
    public void scheduleMedicineNotification(BatchRsp dto) {
        sendSchedule(dto, "SCH_002",
                "복약 알림이 있습니다. 약 드셔야 할 시간 입니다.",
                "앱에서 일정을 확인해주세요.");
    }

    @Override
    public void scheduleHospitalNotification(BatchRsp dto) {
        sendSchedule(dto, "SCH_003",
                "내원 알림이 있습니다. 병원 방문일 입니다.",
                "앱에서 일정을 확인해주세요.");
    }

    @Override
    public void scheduleHospitalNotification2(BatchRsp dto) {
        sendSchedule(dto, "SCH_004",
                "내원 알림이 있습니다. 내일은 병원 방문일 입니다.",
                "앱에서 일정을 확인해주세요.");
    }

    @Override
    public void scheduleCancerInfoNotification(BatchRsp dto) {
        sendSchedule(dto, "SCH_005", "CAMA 알림", "건강을 위한 여정, 오늘도 함께해요.");
    }

    @Override
    public void scheduleCancerInfo5Notification(BatchRsp dto) {
        sendSchedule(dto, "SCH_006", "CAMA 알림",
                "암정보 가이드가 3일 후 종료됩니다. 새롭게 설정하세요!");
    }

    @Override
    public void scheduleCancerInfo6Notification(BatchRsp dto) {
        sendSchedule(dto, "SCH_007", "CAMA 알림",
                "암정보 가이드가 내일 종료됩니다. 새롭게 설정하세요!");
    }

    @Override
    public void scheduleMentalityNotification(BatchRsp dto) {
        sendSchedule(dto, "SCH_008", "CAMA 알림",
                "마음의 근육을 단련할 시간이 되었습니다. 지금 시작해 보세요.");
    }

    @Override
    public void scheduleCancerInfo11Notification(BatchRsp dto) {
        sendSchedule(dto, "SCH_011", "CAMA 알림",
                "오늘의 수면코칭이 도착했어요~\n"
                        + "건강한 수면을 위한 여정을 " + dto.getProgress() + "% 완료하셨습니다.\n"
                        + "CAMA+가 준비한 편안한 잠을 위한 오늘의 솔루션을 확인해보세요.");
    }

    @Override
    public void scheduleCancerInfo12Notification(BatchRsp dto) {
        sendSchedule(dto, "SCH_012", "CAMA 알림",
                "오늘의 식습관코칭이 도착했어요~\n"
                        + "건강한 식습관을 위한 여정을 " + dto.getProgress() + "% 완료하셨습니다.\n"
                        + "CAMA+가 준비한 균형 잡힌 영양을 위한 오늘의 솔루션을 확인해보세요.");
    }

    @Override
    public void scheduleCancerInfo13Notification(BatchRsp dto) {
        sendSchedule(dto, "SCH_013", "CAMA 알림",
                "오늘의 신체활동코칭이 도착했어요~\n"
                        + "활기찬 일상을 위한 여정을 " + dto.getProgress() + "% 완료하셨습니다.\n"
                        + "CAMA+가 준비한 활력 넘치는 하루를 위한 오늘의 솔루션을 확인해보세요.");
    }

    @Override
    public void scheduleCancerInfo14Notification(BatchRsp dto) {
        sendSchedule(dto, "SCH_014", "CAMA 알림",
                "오늘의 운동코칭이 도착했어요~\n"
                        + "건강한 운동을 위한 여정을 " + dto.getProgress() + "% 완료하셨습니다.\n"
                        + "CAMA+가 준비한 효과적인 운동을 위한 오늘의 솔루션을 확인해보세요.");
    }

    @Override
    public void pushTest(String token) {
        fcmMessageSender.send("TEST_001", "테스트 타이틀", "테스트 본문", token);
    }

    private void sendSchedule(BatchRsp dto, String type, String title, String message) {
        if (dto.getToken() == null || dto.getToken().isEmpty()) {
            return;
        }
        fcmMessageSender.send(type, title, message, dto.getToken());
    }

}

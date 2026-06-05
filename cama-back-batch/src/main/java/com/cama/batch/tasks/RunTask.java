package com.cama.batch.tasks;


import com.cama.batch.config.BatchSlackNotifier;
import com.cama.batch.domain.track.TrackService;
import com.cama.batch.domain.track.TrackStatus;
import com.cama.batch.dto.batch.BatchRsp;
import com.cama.batch.dto.schedule.ScheduleType;
import com.cama.batch.dto.track.TrackServiceRsp;
import com.cama.batch.mapper.ScheduleMapper;
import com.cama.batch.mapper.TrackServiceMapper;
import com.cama.batch.repo.track.TrackServiceRepository;
import com.cama.batch.service.notification.NotificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class RunTask {

    private static final Logger logger = LoggerFactory.getLogger(RunTask.class);

    private final ScheduleMapper scheduleMapper;
    private final TrackServiceMapper trackServiceMapper;
    private final NotificationService notificationService;
    private final TrackServiceRepository trackServiceRepository;
    private final BatchSlackNotifier batchSlackNotifier;

    public RunTask(ScheduleMapper scheduleMapper,
                   TrackServiceMapper trackServiceMapper,
                   NotificationService notificationService,
                   TrackServiceRepository trackServiceRepository,
                   BatchSlackNotifier batchSlackNotifier) {
        this.scheduleMapper = scheduleMapper;
        this.trackServiceMapper = trackServiceMapper;
        this.notificationService = notificationService;
        this.trackServiceRepository = trackServiceRepository;
        this.batchSlackNotifier = batchSlackNotifier;
    }

    /** 복약·기타·내원·멘탈 — 해당 분 정각 알림 */
    @Scheduled(cron = "0 0/1 * * * ?", zone = "Asia/Seoul")
    public void batchCheck() {
        runBatchCheck();
    }

    public int runBatchCheck() {
        List<BatchRsp> list = scheduleMapper.getScheduleBatchList();
        for (BatchRsp batchRsp : list) {
            if (ScheduleType.MENTALITY.equals(batchRsp.getScheduleType())) {
                notificationService.scheduleMentalityNotification(batchRsp);
            } else if (ScheduleType.MEDICINE.equals(batchRsp.getScheduleType())) {
                notificationService.scheduleMedicineNotification(batchRsp);
            } else if (ScheduleType.HOSPITAL.equals(batchRsp.getScheduleType())) {
                notificationService.scheduleHospitalNotification(batchRsp);
            } else {
                notificationService.scheduleNotification(batchRsp);
            }
        }
        logger.debug("batchCheck targets={}", list.size());
        return list.size();
    }

    /** 내원 — 전날 같은 시각 알림 */
    @Scheduled(cron = "0 0/1 * * * ?", zone = "Asia/Seoul")
    public void batchCheck2() {
        runBatchCheck2();
    }

    public int runBatchCheck2() {
        List<BatchRsp> list = scheduleMapper.getScheduleBatchList2();
        for (BatchRsp batchRsp : list) {
            if (ScheduleType.HOSPITAL.equals(batchRsp.getScheduleType())) {
                notificationService.scheduleHospitalNotification2(batchRsp);
            }
        }
        logger.debug("batchCheck2 targets={}", list.size());
        return list.size();
    }

    /** 내원·복약 — 1시간 전 알림 */
    @Scheduled(cron = "0 0/1 * * * ?", zone = "Asia/Seoul")
    public void batchCheck3() {
        runBatchCheck3();
    }

    public int runBatchCheck3() {
        List<BatchRsp> list = scheduleMapper.getScheduleBatchList3();
        for (BatchRsp batchRsp : list) {
            if (ScheduleType.HOSPITAL.equals(batchRsp.getScheduleType())) {
                notificationService.scheduleHospitalNotification(batchRsp);
            } else if (ScheduleType.MEDICINE.equals(batchRsp.getScheduleType())) {
                notificationService.scheduleMedicineNotification(batchRsp);
            }
        }
        logger.debug("batchCheck3 targets={}", list.size());
        return list.size();
    }

    /** 암정보 가이드 — 매일 10:00 */
    @Scheduled(cron = "0 0 10 * * ?", zone = "Asia/Seoul")
    public void batchCheck4() {
        runBatchCheck4();
    }

    public int runBatchCheck4() {
        List<BatchRsp> list = scheduleMapper.getScheduleBatchList4();
        for (BatchRsp batchRsp : list) {
            notificationService.scheduleCancerInfoNotification(batchRsp);
        }
        logger.info("batchCheck4 cancer guide targets={}", list.size());
        return list.size();
    }

    /** 암정보 가이드 종료 D-3 — 매일 15:00 */
    @Scheduled(cron = "0 0 15 * * ?", zone = "Asia/Seoul")
    public void batchCheck5() {
        runBatchCheck5();
    }

    public int runBatchCheck5() {
        List<BatchRsp> list = scheduleMapper.getScheduleBatchList5();
        for (BatchRsp batchRsp : list) {
            notificationService.scheduleCancerInfo5Notification(batchRsp);
        }
        logger.info("batchCheck5 guide D-3 targets={}", list.size());
        return list.size();
    }

    /** 암정보 가이드 종료 D-1 — 매일 15:00 */
    @Scheduled(cron = "0 0 15 * * ?", zone = "Asia/Seoul")
    public void batchCheck6() {
        runBatchCheck6();
    }

    public int runBatchCheck6() {
        List<BatchRsp> list = scheduleMapper.getScheduleBatchList6();
        for (BatchRsp batchRsp : list) {
            notificationService.scheduleCancerInfo6Notification(batchRsp);
        }
        logger.info("batchCheck6 guide D-1 targets={}", list.size());
        return list.size();
    }

    /** 수면 코칭 A — 17:00 */
    @Scheduled(cron = "0 0 17 * * ?", zone = "Asia/Seoul")
    public void batchCheck11() {
        runBatchCheck11();
    }

    public int runBatchCheck11() {
        List<BatchRsp> list = scheduleMapper.getScheduleBatchList11("A");
        for (BatchRsp batchRsp : list) {
            notificationService.scheduleCancerInfo11Notification(batchRsp);
        }
        logger.info("batchCheck11 sleep coaching targets={}", list.size());
        return list.size();
    }

    /** 식습관 코칭 B — 09:00 */
    @Scheduled(cron = "0 0 9 * * ?", zone = "Asia/Seoul")
    public void batchCheck12() {
        runBatchCheck12();
    }

    public int runBatchCheck12() {
        List<BatchRsp> list = scheduleMapper.getScheduleBatchList11("B");
        for (BatchRsp batchRsp : list) {
            notificationService.scheduleCancerInfo12Notification(batchRsp);
        }
        logger.info("batchCheck12 diet coaching targets={}", list.size());
        return list.size();
    }

    /** 신체활동 코칭 D — 11:00 */
    @Scheduled(cron = "0 0 11 * * ?", zone = "Asia/Seoul")
    public void batchCheck13() {
        runBatchCheck13();
    }

    public int runBatchCheck13() {
        List<BatchRsp> list = scheduleMapper.getScheduleBatchList11("D");
        for (BatchRsp batchRsp : list) {
            notificationService.scheduleCancerInfo13Notification(batchRsp);
        }
        logger.info("batchCheck13 activity coaching targets={}", list.size());
        return list.size();
    }

    /** 운동 코칭 E — 16:00 */
    @Scheduled(cron = "0 0 16 * * ?", zone = "Asia/Seoul")
    public void batchCheck14() {
        runBatchCheck14();
    }

    public int runBatchCheck14() {
        List<BatchRsp> list = scheduleMapper.getScheduleBatchList11("E");
        for (BatchRsp batchRsp : list) {
            notificationService.scheduleCancerInfo14Notification(batchRsp);
        }
        logger.info("batchCheck14 exercise coaching targets={}", list.size());
        return list.size();
    }

    /** 만료 track_service → CANCEL — 01:00 */
    @Scheduled(cron = "0 0 1 * * ?", zone = "Asia/Seoul")
    public void dayOneBatch() {
        runDayOneBatch();
    }

    public int runDayOneBatch() {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        batchSlackNotifier.notify("새벽 1시 배치 -> 지금 시간은 ? "
                + LocalDateTime.now(ZoneId.of("Asia/Seoul")).format(fmt));

        List<TrackServiceRsp> list = trackServiceMapper.getTrackActiveServiceList();
        List<Long> collect = new ArrayList<>();
        for (TrackServiceRsp rsp : list) {
            collect.add(rsp.getSeq());
        }

        if (collect.isEmpty()) {
            logger.info("dayOneBatch: no expired tracks");
            return 0;
        }

        List<TrackService> ts = trackServiceRepository.findBySeqIn(collect);
        List<TrackService> after = ts.stream().map(s -> {
            s.setStatus(TrackStatus.CANCEL);
            return s;
        }).collect(Collectors.toList());

        batchSlackNotifier.notify("업데이트 숫자는 ? " + after.size());
        trackServiceRepository.saveAll(after);
        logger.info("dayOneBatch cancelled tracks={}", after.size());
        return after.size();
    }

    /** 계정 통계 — 23:00 */
    @Scheduled(cron = "0 0 23 * * ?", zone = "Asia/Seoul")
    public void accountStatisticsBatch() {
        runAccountStatisticsBatch();
    }

    public void runAccountStatisticsBatch() {
        saveAccountStatistics("10");
        saveAccountStatistics("20");
        saveAccountStatistics("99");
        logger.info("accountStatisticsBatch completed");
    }

    private void saveAccountStatistics(String userTypeCd) {
        int existCnt = scheduleMapper.getExistStatistics(userTypeCd);
        String queryUserType = userTypeCd;
        if ("99".equals(userTypeCd)) {
            queryUserType = "";
        }
        int userCnt = nullToZero(scheduleMapper.getUserCnt(queryUserType));
        int dayEnableCnt = nullToZero(scheduleMapper.getDayEnableCnt(queryUserType));
        int monthEnableCnt = nullToZero(scheduleMapper.getMonthEnableCnt(queryUserType));

        if (existCnt < 1) {
            scheduleMapper.insertAcctStatistics(userTypeCd, userCnt, dayEnableCnt, monthEnableCnt);
        } else {
            scheduleMapper.updateAcctStatistics(userTypeCd, userCnt, dayEnableCnt, monthEnableCnt);
        }
        logger.debug("statistics userType={} users={} dayAvg={} month={}", userTypeCd, userCnt, dayEnableCnt,
                monthEnableCnt);
    }

    private static int nullToZero(Integer value) {
        return value != null ? value : 0;
    }
}

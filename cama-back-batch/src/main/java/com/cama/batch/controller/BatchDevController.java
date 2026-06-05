package com.cama.batch.controller;

import com.cama.batch.tasks.RunTask;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * 로컬(local-gabia)에서 스케줄 잡을 수동 실행 — 운영 프로필에서는 비활성.
 */
@RestController
@RequestMapping("/api/batch/dev")
@Profile("local-cafe24")
public class BatchDevController {

    private final RunTask runTask;

    public BatchDevController(RunTask runTask) {
        this.runTask = runTask;
    }

    @GetMapping("/jobs")
    public Map<String, String> listJobs() {
        Map<String, String> jobs = new LinkedHashMap<>();
        jobs.put("check1", "일정 알림 (복약/내원/기타/멘탈, 정각)");
        jobs.put("check2", "내원 D-1 알림");
        jobs.put("check3", "내원/복약 1시간 전");
        jobs.put("check4", "암정보 가이드 10시");
        jobs.put("check5", "가이드 종료 D-3");
        jobs.put("check6", "가이드 종료 D-1");
        jobs.put("check11", "수면 코칭 A 17시");
        jobs.put("check12", "식습관 코칭 B 9시");
        jobs.put("check13", "신체활동 코칭 D 11시");
        jobs.put("check14", "운동 코칭 E 16시");
        jobs.put("track-expire", "만료 track_service CANCEL");
        jobs.put("statistics", "계정 통계 집계");
        return jobs;
    }

    @GetMapping("/run/{job}")
    public Map<String, Object> runJob(@PathVariable String job) {
        int targets;
        switch (job) {
            case "check1":
                targets = runTask.runBatchCheck();
                break;
            case "check2":
                targets = runTask.runBatchCheck2();
                break;
            case "check3":
                targets = runTask.runBatchCheck3();
                break;
            case "check4":
                targets = runTask.runBatchCheck4();
                break;
            case "check5":
                targets = runTask.runBatchCheck5();
                break;
            case "check6":
                targets = runTask.runBatchCheck6();
                break;
            case "check11":
                targets = runTask.runBatchCheck11();
                break;
            case "check12":
                targets = runTask.runBatchCheck12();
                break;
            case "check13":
                targets = runTask.runBatchCheck13();
                break;
            case "check14":
                targets = runTask.runBatchCheck14();
                break;
            case "track-expire":
                targets = runTask.runDayOneBatch();
                break;
            case "statistics":
                runTask.runAccountStatisticsBatch();
                targets = 3;
                break;
            default:
                throw new IllegalArgumentException("Unknown job: " + job);
        }
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("job", job);
        result.put("targets", targets);
        result.put("fcmDryRun", true);
        return result;
    }
}

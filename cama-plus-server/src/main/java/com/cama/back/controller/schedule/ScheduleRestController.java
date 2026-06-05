package com.cama.back.controller.schedule;


import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.common.CommonDate;
import com.cama.back.domain.schedule.AccountBatchSchedule;
import com.cama.back.domain.schedule.AccountSchedule;
import com.cama.back.dto.schedule.ScheduleRequest;
import com.cama.back.dto.schedule.ScheduleRsp;
import com.cama.back.exception.ScheduleBatchNotFoundException;
import com.cama.back.exception.ScheduleNotFoundException;
import com.cama.back.mapper.ScheduleMapper;
import com.cama.back.repo.schedule.BatchScheduleRepository;
import com.cama.back.repo.schedule.ScheduleRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.time.temporal.ChronoUnit.DAYS;

@RestController
@RequestMapping("api")
@Tag(name = "일정 관리 APIs")
public class ScheduleRestController {

    private final ScheduleRepository scheduleRepository;
    private final ScheduleMapper scheduleMapper;
    private final BatchScheduleRepository batchScheduleRepository;

    public ScheduleRestController(ScheduleRepository scheduleRepository, ScheduleMapper scheduleMapper, BatchScheduleRepository batchScheduleRepository) {
        this.scheduleRepository = scheduleRepository;
        this.scheduleMapper = scheduleMapper;
        this.batchScheduleRepository = batchScheduleRepository;
    }

    @GetMapping(path = "schedule")
    @Operation(summary = "일정 조회")
    public ApiResult<List<ScheduleRsp>> getSchedule(@AuthenticationPrincipal JwtAuthentication authentication, @RequestParam String d) {

        Long acSeq = authentication.id.value();

        List<ScheduleRsp> list = scheduleMapper.getAccountSchedule(acSeq, d);
        return new ApiResult<>(list);

    }

    @GetMapping(path = "webview/schedule")
    @Operation(summary = "일정 조회")
    public ApiResult<List<ScheduleRsp>> getWebviewSchedule(@AuthenticationPrincipal JwtAuthentication authentication, @RequestParam String d, @RequestParam Long acSeq) {

        //Long acSeq = authentication.id.value();

        List<ScheduleRsp> list = scheduleMapper.getAccountSchedule(acSeq, d);
        return new ApiResult<>(list);

    }

    @GetMapping(path = "schedule/monthly")
    @Operation(summary = "일정 조회(월별)")
    public ApiResult<List<ScheduleRsp>> getScheduleMonthly(@AuthenticationPrincipal JwtAuthentication authentication, @RequestParam String monthly) {

        Long acSeq = authentication.id.value();

        LocalDate date = LocalDate.parse(monthly,DateTimeFormatter.ofPattern("yyyyMMdd"));
        LocalDate first = date.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate last = date.with(TemporalAdjusters.lastDayOfMonth());

        List<ScheduleRsp> list = scheduleMapper.getAccountScheduleMonthly(acSeq, first.toString(), last.toString());

        return new ApiResult<>(list);

    }

    @GetMapping(path = "webview/schedule/monthly")
    @Operation(summary = "일정 조회(월별)")
    public ApiResult<List<ScheduleRsp>> getWebviewScheduleMonthly(@AuthenticationPrincipal JwtAuthentication authentication, @RequestParam String monthly, @RequestParam Long acSeq) {

        //Long acSeq = authentication.id.value();

        LocalDate date = LocalDate.parse(monthly,DateTimeFormatter.ofPattern("yyyyMMdd"));
        LocalDate first = date.with(TemporalAdjusters.firstDayOfMonth());
        LocalDate last = date.with(TemporalAdjusters.lastDayOfMonth());

        List<ScheduleRsp> list = scheduleMapper.getAccountScheduleMonthly(acSeq, first.toString(), last.toString());

        return new ApiResult<>(list);

    }

    @PostMapping(path = "schedule")
    @Operation(summary = "일정 등록")
    public ApiResult<Boolean> postSchedule(@AuthenticationPrincipal JwtAuthentication authentication,
                                           @RequestBody ScheduleRequest dto) {

        Long acSeq = authentication.id.value();

        AccountSchedule schedule = scheduleRepository.save(AccountSchedule.builder()
                .accountSeq(acSeq)
                //.diseaseSeq(dto.getDiseaseSeq())
                .scheduleName(dto.getScheduleName())
                .scheduleType(dto.getScheduleType())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .time(dto.getTime())
                .days(dto.getDays())
                .repeat(dto.isRepeat())
                .alarm(dto.isAlarm())
                .memo(dto.getMemo())
                .enabled(true)
                .build());

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate sDate = LocalDate.parse(dto.getStartDate(), fmt);
        LocalDate eDate = LocalDate.parse(dto.getEndDate(), fmt);

        long days = DAYS.between(sDate, eDate);

        List<AccountBatchSchedule> list = new ArrayList<>();

        if (dto.isRepeat()) {
            for (int i = 0; i <= days; i++) {

                LocalDate day = sDate.plusDays(i);

                int dayValue = day.getDayOfWeek().getValue();
                if (dto.getDays().contains((long) dayValue)) {
                    list.add(AccountBatchSchedule.builder()
                            .accountSeq(acSeq)
                            .scheduleSeq(schedule.getSeq())
                            .startDate(day.toString())
                            .endDate(day.toString())
                            .time(dto.getTime())
                            .done(false)
                            .enabled(true)
                            .build());
                }
            }
        } else {
            list.add(AccountBatchSchedule.builder()
                    .accountSeq(acSeq)
                    .scheduleSeq(schedule.getSeq())
                    .startDate(dto.getStartDate())
                    .endDate(dto.getEndDate())
                    .time(dto.getTime())
                    .done(false)
                    .enabled(true)
                    .build());

        }


        batchScheduleRepository.saveAll(list);

        return new ApiResult<>(true);

    }

    @PostMapping(path = "webview/schedule")
    @Operation(summary = "일정 등록")
    public ApiResult<Boolean> postWebviewSchedule(@AuthenticationPrincipal JwtAuthentication authentication,
                                           @RequestBody ScheduleRequest dto) {

        Long acSeq = dto.getAcSeq();

        AccountSchedule schedule = scheduleRepository.save(AccountSchedule.builder()
                .accountSeq(acSeq)
                //.diseaseSeq(dto.getDiseaseSeq())
                .scheduleName(dto.getScheduleName())
                .scheduleType(dto.getScheduleType())
                .startDate(dto.getStartDate())
                .endDate(dto.getEndDate())
                .time(dto.getTime())
                .days(dto.getDays())
                .repeat(dto.isRepeat())
                .alarm(dto.isAlarm())
                .memo(dto.getMemo())
                .enabled(true)
                .build());

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        LocalDate sDate = LocalDate.parse(dto.getStartDate(), fmt);
        LocalDate eDate = LocalDate.parse(dto.getEndDate(), fmt);

        long days = DAYS.between(sDate, eDate);

        List<AccountBatchSchedule> list = new ArrayList<>();

        if (dto.isRepeat()) {
            for (int i = 0; i <= days; i++) {

                LocalDate day = sDate.plusDays(i);

                int dayValue = day.getDayOfWeek().getValue();
                if (dto.getDays().contains((long) dayValue)) {
                    list.add(AccountBatchSchedule.builder()
                            .accountSeq(acSeq)
                            .scheduleSeq(schedule.getSeq())
                            .startDate(day.toString())
                            .endDate(day.toString())
                            .time(dto.getTime())
                            .done(false)
                            .enabled(true)
                            .build());
                }
            }
        } else {
            list.add(AccountBatchSchedule.builder()
                    .accountSeq(acSeq)
                    .scheduleSeq(schedule.getSeq())
                    .startDate(dto.getStartDate())
                    .endDate(dto.getEndDate())
                    .time(dto.getTime())
                    .done(false)
                    .enabled(true)
                    .build());

        }


        batchScheduleRepository.saveAll(list);

        return new ApiResult<>(true);

    }

    @PostMapping(path = "schedule/{batchSeq}/done")
    @Operation(summary = "일정 완료처리")
    public ApiResult<Boolean> postScheduleDone(@AuthenticationPrincipal JwtAuthentication authentication,
                                               @PathVariable Long batchSeq) {

        Long acSeq = authentication.id.value();

        if (!batchScheduleRepository.findBySeqAndAccountSeqAndEnabled(batchSeq, acSeq, true).isPresent()) {
            throw new ScheduleBatchNotFoundException();
        }

        AccountBatchSchedule batchSchedule = batchScheduleRepository.findBySeqAndAccountSeqAndEnabled(batchSeq, acSeq, true).get();
        batchSchedule.setDone(true);
        batchScheduleRepository.save(batchSchedule);

        return new ApiResult<>(true);

    }

    @PostMapping(path = "webview/schedule/{batchSeq}/done/{acSeq}")
    @Operation(summary = "일정 완료처리")
    public ApiResult<Boolean> postWebviewScheduleDone(@AuthenticationPrincipal JwtAuthentication authentication,
                                               @PathVariable Long batchSeq, @PathVariable Long acSeq) {

        //Long acSeq = authentication.id.value();

        if (!batchScheduleRepository.findBySeqAndAccountSeqAndEnabled(batchSeq, acSeq, true).isPresent()) {
            throw new ScheduleBatchNotFoundException();
        }

        AccountBatchSchedule batchSchedule = batchScheduleRepository.findBySeqAndAccountSeqAndEnabled(batchSeq, acSeq, true).get();
        batchSchedule.setDone(true);
        batchScheduleRepository.save(batchSchedule);

        return new ApiResult<>(true);

    }

    @PostMapping(path = "schedule/{batchSeq}/unDone")
    @Operation(summary = "일정 미완료처리")
    public ApiResult<Boolean> postScheduleUnDone(@AuthenticationPrincipal JwtAuthentication authentication,
                                               @PathVariable Long batchSeq) {

        Long acSeq = authentication.id.value();

        if (!batchScheduleRepository.findBySeqAndAccountSeqAndEnabled(batchSeq, acSeq, true).isPresent()) {
            throw new ScheduleBatchNotFoundException();
        }

        AccountBatchSchedule batchSchedule = batchScheduleRepository.findBySeqAndAccountSeqAndEnabled(batchSeq, acSeq, true).get();
        batchSchedule.setDone(false);
        batchScheduleRepository.save(batchSchedule);

        return new ApiResult<>(true);

    }

    @PostMapping(path = "webview/schedule/{batchSeq}/unDone/{acSeq}")
    @Operation(summary = "일정 미완료처리")
    public ApiResult<Boolean> postWebviewScheduleUnDone(@AuthenticationPrincipal JwtAuthentication authentication,
                                               @PathVariable Long batchSeq, @PathVariable Long acSeq) {

        //Long acSeq = authentication.id.value();

        if (!batchScheduleRepository.findBySeqAndAccountSeqAndEnabled(batchSeq, acSeq, true).isPresent()) {
            throw new ScheduleBatchNotFoundException();
        }

        AccountBatchSchedule batchSchedule = batchScheduleRepository.findBySeqAndAccountSeqAndEnabled(batchSeq, acSeq, true).get();
        batchSchedule.setDone(false);
        batchScheduleRepository.save(batchSchedule);

        return new ApiResult<>(true);

    }

    @PutMapping(path = "schedule/{seq}/view")
    @Operation(summary = "일정 수정")
    public ApiResult<Boolean> putSchedule(@AuthenticationPrincipal JwtAuthentication authentication,
                                          @PathVariable Long seq,
                                          @RequestBody ScheduleRequest dto) {

        Long acSeq = authentication.id.value();

        if (!scheduleRepository.findByAccountSeqAndSeqAndEnabled(acSeq, seq, true).isPresent()) {
            throw new ScheduleNotFoundException();
        }

        AccountSchedule schedule = scheduleRepository.findByAccountSeqAndSeqAndEnabled(acSeq, seq, true).get();

        //schedule.setDiseaseSeq(dto.getDiseaseSeq());
        schedule.setScheduleName(dto.getScheduleName());
        schedule.setScheduleType(dto.getScheduleType());
        schedule.setStartDate(dto.getStartDate());
        schedule.setEndDate(dto.getEndDate());
        schedule.setTime(dto.getTime());
        schedule.setDays(dto.getDays());
        schedule.setRepeat(dto.isRepeat());
        schedule.setAlarm(dto.isAlarm());
        schedule.setMemo(dto.getMemo());

        scheduleRepository.save(schedule);


        // 비 활성화
        List<AccountBatchSchedule> schedules = batchScheduleRepository.findByScheduleSeqAndEnabled(seq, true);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        List<AccountBatchSchedule> collect = schedules.stream().peek(s ->
                s.setEnabled(false)).collect(Collectors.toList());

        batchScheduleRepository.saveAll(collect);

        LocalDate sDate = LocalDate.parse(dto.getStartDate(), fmt);
        LocalDate eDate = LocalDate.parse(dto.getEndDate(), fmt);

        long days = DAYS.between(sDate, eDate);

        List<AccountBatchSchedule> list = new ArrayList<>();

        if (dto.isRepeat()) {
            for (int i = 0; i <= days; i++) {

                LocalDate day = sDate.plusDays(i);

                int dayValue = day.getDayOfWeek().getValue();

                System.out.println(day + "<<>>" + dayValue);

                if (dto.getDays().contains((long) dayValue)) {

                    LocalDate now = LocalDate.now(ZoneId.of("Asia/Seoul"));
                    //if (!day.isBefore(now) && !day.isEqual(now)) {
                        list.add(AccountBatchSchedule.builder()
                                .accountSeq(acSeq)
                                .scheduleSeq(schedule.getSeq())
                                .startDate(day.toString())
                                .endDate(day.toString())
                                .time(dto.getTime())
                                .done(false)
                                .enabled(true)
                                .build());
                    //}

                }
            }
        } else {
            list.add(AccountBatchSchedule.builder()
                    .accountSeq(acSeq)
                    .scheduleSeq(schedule.getSeq())
                    .startDate(dto.getStartDate())
                    .endDate(dto.getEndDate())
                    .time(dto.getTime())
                    .done(false)
                    .enabled(true)
                    .build());
        }

        batchScheduleRepository.saveAll(list);

        return new ApiResult<>(true);

    }

    @PutMapping(path = "webview/schedule/{seq}/view")
    @Operation(summary = "일정 수정")
    public ApiResult<Boolean> putWebviewSchedule(@AuthenticationPrincipal JwtAuthentication authentication,
                                          @PathVariable Long seq,
                                          @RequestBody ScheduleRequest dto) {

        Long acSeq = dto.getAcSeq();

        if (!scheduleRepository.findByAccountSeqAndSeqAndEnabled(acSeq, seq, true).isPresent()) {
            throw new ScheduleNotFoundException();
        }

        AccountSchedule schedule = scheduleRepository.findByAccountSeqAndSeqAndEnabled(acSeq, seq, true).get();

        //schedule.setDiseaseSeq(dto.getDiseaseSeq());
        schedule.setScheduleName(dto.getScheduleName());
        schedule.setScheduleType(dto.getScheduleType());
        schedule.setStartDate(dto.getStartDate());
        schedule.setEndDate(dto.getEndDate());
        schedule.setTime(dto.getTime());
        schedule.setDays(dto.getDays());
        schedule.setRepeat(dto.isRepeat());
        schedule.setAlarm(dto.isAlarm());
        schedule.setMemo(dto.getMemo());

        scheduleRepository.save(schedule);


        // 비 활성화
        List<AccountBatchSchedule> schedules = batchScheduleRepository.findByScheduleSeqAndEnabled(seq, true);

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        List<AccountBatchSchedule> collect = schedules.stream().peek(s ->
                s.setEnabled(false)).collect(Collectors.toList());

        batchScheduleRepository.saveAll(collect);

        LocalDate sDate = LocalDate.parse(dto.getStartDate(), fmt);
        LocalDate eDate = LocalDate.parse(dto.getEndDate(), fmt);

        long days = DAYS.between(sDate, eDate);

        List<AccountBatchSchedule> list = new ArrayList<>();

        if (dto.isRepeat()) {
            for (int i = 0; i <= days; i++) {

                LocalDate day = sDate.plusDays(i);

                int dayValue = day.getDayOfWeek().getValue();

                System.out.println(day + "<<>>" + dayValue);

                if (dto.getDays().contains((long) dayValue)) {

                    LocalDate now = LocalDate.now(ZoneId.of("Asia/Seoul"));
                    //if (!day.isBefore(now) && !day.isEqual(now)) {
                        list.add(AccountBatchSchedule.builder()
                                .accountSeq(acSeq)
                                .scheduleSeq(schedule.getSeq())
                                .startDate(day.toString())
                                .endDate(day.toString())
                                .time(dto.getTime())
                                .done(false)
                                .enabled(true)
                                .build());
                    //}

                }
            }
        } else {
            list.add(AccountBatchSchedule.builder()
                    .accountSeq(acSeq)
                    .scheduleSeq(schedule.getSeq())
                    .startDate(dto.getStartDate())
                    .endDate(dto.getEndDate())
                    .time(dto.getTime())
                    .done(false)
                    .enabled(true)
                    .build());
        }

        batchScheduleRepository.saveAll(list);

        return new ApiResult<>(true);

    }


    @DeleteMapping(path = "schedule/{seq}/view")
    @Operation(summary = "일정 삭제")
    public ApiResult<Boolean> deleteSchedule(@AuthenticationPrincipal JwtAuthentication authentication,
                                          @PathVariable Long seq) {

        Long acSeq = authentication.id.value();

        if (!scheduleRepository.findByAccountSeqAndSeqAndEnabled(acSeq, seq, true).isPresent()) {
            throw new ScheduleNotFoundException();
        }

        AccountSchedule schedule = scheduleRepository.findByAccountSeqAndSeqAndEnabled(acSeq, seq, true).get();
        schedule.setEnabled(false);

        scheduleRepository.save(schedule);

        return new ApiResult<>(true);

    }

    @DeleteMapping(path = "webview/schedule/{seq}/view/{acSeq}")
    @Operation(summary = "일정 삭제")
    public ApiResult<Boolean> deleteWebviewSchedule(@AuthenticationPrincipal JwtAuthentication authentication,
                                          @PathVariable Long seq, @PathVariable Long acSeq) {

        //Long acSeq = authentication.id.value();

        if (!scheduleRepository.findByAccountSeqAndSeqAndEnabled(acSeq, seq, true).isPresent()) {
            throw new ScheduleNotFoundException();
        }

        AccountSchedule schedule = scheduleRepository.findByAccountSeqAndSeqAndEnabled(acSeq, seq, true).get();
        schedule.setEnabled(false);

        scheduleRepository.save(schedule);

        return new ApiResult<>(true);

    }

}

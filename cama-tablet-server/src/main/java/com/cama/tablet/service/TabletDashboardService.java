package com.cama.tablet.service;

import com.cama.tablet.dto.*;
import com.cama.tablet.mapper.TabletDashboardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TabletDashboardService {

    private final TabletDashboardMapper mapper;
    private final QrPayloadParser qrPayloadParser;

    public DashboardResponse resolveScan(QrScanRequest request) {
        QrPayload payload = qrPayloadParser.parse(request.getPayload());
        Long accountSeq = payload.getAccountSeq();
        if (accountSeq == null && payload.getLoginId() != null) {
            PatientSummaryDto byLogin = mapper.findPatientByLoginId(payload.getLoginId());
            if (byLogin != null) {
                accountSeq = byLogin.getSeq();
            }
        }
        if (accountSeq == null) {
            throw new IllegalArgumentException("Patient not found in QR");
        }
        return buildDashboard(accountSeq);
    }

    public DashboardResponse buildDashboard(Long accountSeq) {
        PatientSummaryDto patient = mapper.findPatientBySeq(accountSeq);
        if (patient == null) {
            throw new IllegalArgumentException("Patient not found: " + accountSeq);
        }

        List<StepDailyDto> steps = mapper.findRecentSteps(accountSeq, 14);
        if (steps == null) {
            steps = Collections.emptyList();
        }

        DashboardResponse res = new DashboardResponse();
        res.setPatient(patient);
        res.setSteps(steps);
        res.setStepsToday(nullToZero(mapper.findTodaySteps(accountSeq)));
        res.setStepsAvg7d(nullToZero(mapper.findAvgSteps7d(accountSeq)));
        res.setCoaching(nullToList(mapper.findCoachingProgress(accountSeq)));
        res.setInquiries(nullToList(mapper.findTreatmentInquiries(accountSeq, 10)));

        HeartRateDto hr = new HeartRateDto();
        hr.setAvailable(false);
        hr.setMessage("심박 데이터는 추후 연동 예정입니다.");
        res.setHeartRate(hr);

        return res;
    }

    private static long nullToZero(Long v) {
        return v == null ? 0L : v;
    }

    private static <T> List<T> nullToList(List<T> list) {
        return list == null ? Collections.emptyList() : list;
    }
}

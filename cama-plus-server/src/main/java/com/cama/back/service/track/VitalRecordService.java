package com.cama.back.service.track;

import com.cama.back.dto.track.VitalRecordDto;
import com.cama.back.dto.track.VitalRecordQuery;
import com.cama.back.dto.track.VitalRecordRequest;
import com.cama.back.mapper.VitalMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class VitalRecordService {

    private static final Set<String> ALLOWED_TYPES = Set.of(
            "HEART_RATE",
            "BP_SYSTOLIC",
            "BP_DIASTOLIC",
            "SPO2",
            "BODY_TEMP",
            "RESPIRATORY_RATE"
    );

    private static final Set<String> ALLOWED_SOURCES = Set.of("MANUAL", "PHONE", "WEARABLE");

    private static final Map<String, String> DEFAULT_UNITS = Map.of(
            "HEART_RATE", "bpm",
            "BP_SYSTOLIC", "mmHg",
            "BP_DIASTOLIC", "mmHg",
            "SPO2", "%",
            "BODY_TEMP", "C",
            "RESPIRATORY_RATE", "/min"
    );

    private final VitalMapper vitalMapper;

    public void save(Long accountSeq, VitalRecordRequest request) {
        validateAndNormalize(accountSeq, request);
        vitalMapper.saveVitalRecord(request);
    }

    public int saveBatch(Long accountSeq, List<VitalRecordRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new IllegalArgumentException("저장할 생체신호가 없습니다.");
        }
        int saved = 0;
        for (VitalRecordRequest request : requests) {
            save(accountSeq, request);
            saved++;
        }
        return saved;
    }

    public List<VitalRecordDto> list(VitalRecordQuery query) {
        if (query.getAccountSeq() == null) {
            throw new IllegalArgumentException("accountSeq가 필요합니다.");
        }
        if (query.getLimit() == null || query.getLimit() <= 0) {
            query.setLimit(100);
        }
        if (query.getLimit() > 500) {
            query.setLimit(500);
        }
        return vitalMapper.getVitalRecordList(query);
    }

    private void validateAndNormalize(Long accountSeq, VitalRecordRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("요청 본문이 비어 있습니다.");
        }
        request.setAccountSeq(accountSeq);

        if (!StringUtils.hasText(request.getMeasuredAt())) {
            throw new IllegalArgumentException("measuredAt(측정 시각)이 필요합니다.");
        }

        String type = normalizeCode(request.getVitalTypeCd());
        if (!ALLOWED_TYPES.contains(type)) {
            throw new IllegalArgumentException(
                    "vitalTypeCd는 HEART_RATE, BP_SYSTOLIC, BP_DIASTOLIC, SPO2, BODY_TEMP, RESPIRATORY_RATE 중 하나여야 합니다.");
        }
        request.setVitalTypeCd(type);

        if (request.getValueNum() == null) {
            throw new IllegalArgumentException("valueNum(측정값)이 필요합니다.");
        }
        validateRange(type, request.getValueNum());

        if (!StringUtils.hasText(request.getUnit())) {
            request.setUnit(DEFAULT_UNITS.get(type));
        }

        String source = StringUtils.hasText(request.getSourceCd())
                ? normalizeCode(request.getSourceCd())
                : "MANUAL";
        if (!ALLOWED_SOURCES.contains(source)) {
            throw new IllegalArgumentException("sourceCd는 MANUAL, PHONE, WEARABLE 중 하나여야 합니다.");
        }
        request.setSourceCd(source);
    }

    private static String normalizeCode(String value) {
        return value.trim().toUpperCase(Locale.ROOT);
    }

    private static void validateRange(String type, double value) {
        switch (type) {
            case "HEART_RATE" -> requireBetween(value, 20, 300, "심박수(bpm)");
            case "BP_SYSTOLIC" -> requireBetween(value, 50, 300, "수축기 혈압(mmHg)");
            case "BP_DIASTOLIC" -> requireBetween(value, 30, 200, "이완기 혈압(mmHg)");
            case "SPO2" -> requireBetween(value, 50, 100, "산소포화도(%)");
            case "BODY_TEMP" -> requireBetween(value, 30, 45, "체온(℃)");
            case "RESPIRATORY_RATE" -> requireBetween(value, 5, 60, "호흡수(/min)");
            default -> throw new IllegalArgumentException("지원하지 않는 vitalTypeCd입니다.");
        }
    }

    private static void requireBetween(double value, double min, double max, String label) {
        if (value < min || value > max) {
            throw new IllegalArgumentException(label + " 범위는 " + min + "~" + max + " 입니다.");
        }
    }
}

package com.cama.back.service.track;

import com.cama.back.dto.track.VitalRecordRequest;
import com.cama.back.mapper.VitalMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;

@ExtendWith(MockitoExtension.class)
class VitalRecordServiceTest {

    @Mock
    private VitalMapper vitalMapper;

    @InjectMocks
    private VitalRecordService vitalRecordService;

    @Test
    void saveHeartRateOk() {
        VitalRecordRequest req = VitalRecordRequest.builder()
                .measuredAt("2026-06-03 10:00:00")
                .vitalTypeCd("heart_rate")
                .valueNum(72.0)
                .sourceCd("phone")
                .build();

        vitalRecordService.save(558L, req);

        verify(vitalMapper).saveVitalRecord(any(VitalRecordRequest.class));
    }

    @Test
    void rejectOutOfRangeHeartRate() {
        VitalRecordRequest req = VitalRecordRequest.builder()
                .measuredAt("2026-06-03 10:00:00")
                .vitalTypeCd("HEART_RATE")
                .valueNum(5.0)
                .build();

        assertThrows(IllegalArgumentException.class, () -> vitalRecordService.save(1L, req));
    }
}

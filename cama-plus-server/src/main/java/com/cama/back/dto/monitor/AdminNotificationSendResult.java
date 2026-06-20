package com.cama.back.dto.monitor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminNotificationSendResult {

    private boolean testModePrepared;

    private int backedUpScheduleCount;

    private int sentCount;

    private int failedCount;

    private int skippedNoTokenCount;

    private List<AdminNotificationSendItem> items;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminNotificationSendItem {
        private Long accountSeq;
        private String name;
        private boolean success;
        private String detail;
    }
}

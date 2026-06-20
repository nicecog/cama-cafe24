package com.cama.back.dto.monitor;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FcmTestModeStatusRsp {

    private boolean active;

    private String sessionId;

    private int backedUpScheduleCount;

    private String preparedAt;
}

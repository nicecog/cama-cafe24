package com.cama.back.dto.monitor;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
public class AdminNotificationSendRequest {

    private List<Long> accountSeqs;

    private String message;

    private String sendDate;

    private String sendTime;
}

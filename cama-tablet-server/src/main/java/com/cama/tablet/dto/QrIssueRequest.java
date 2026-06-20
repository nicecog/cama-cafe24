package com.cama.tablet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QrIssueRequest {
    private Long accountSeq;
    private String loginId;
    /** allow-dev-issue=true 일 때만 사용 */
    private String devKey;
}

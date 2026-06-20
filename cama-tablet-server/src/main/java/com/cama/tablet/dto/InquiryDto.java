package com.cama.tablet.dto;

import lombok.Getter;
import lombok.Setter;

/** 치료정보(cm_contents) 기반 Q&A — 추후 1:1 문의 테이블로 확장 */
@Getter
@Setter
public class InquiryDto {
    private Long contentsSeq;
    private String title;
    private String preview;
    private String updatedAt;
}

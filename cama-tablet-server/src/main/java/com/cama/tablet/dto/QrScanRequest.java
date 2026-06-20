package com.cama.tablet.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class QrScanRequest {
    /** Raw QR string (JSON or URL) */
    private String payload;
}

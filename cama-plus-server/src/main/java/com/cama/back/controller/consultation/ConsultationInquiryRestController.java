package com.cama.back.controller.consultation;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.dto.consultation.ConsultationInquiryRequest;
import com.cama.back.dto.consultation.ConsultationInquiryRsp;
import com.cama.back.dto.consultation.ConsultationInquiryTransmitRequest;
import com.cama.back.service.consultation.ConsultationInquiryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
@Tag(name = "진찰시 문의사항 APIs")
public class ConsultationInquiryRestController {

    private final ConsultationInquiryService consultationInquiryService;

    public ConsultationInquiryRestController(ConsultationInquiryService consultationInquiryService) {
        this.consultationInquiryService = consultationInquiryService;
    }

    @GetMapping(path = "webview/consultation-inquiry")
    @Operation(summary = "진찰시 문의사항 목록 조회")
    public ApiResult<List<ConsultationInquiryRsp>> getWebviewConsultationInquiries(
            @RequestParam Long acSeq) {
        return new ApiResult<>(consultationInquiryService.listActive(acSeq));
    }

    @PostMapping(path = "webview/consultation-inquiry")
    @Operation(summary = "진찰시 문의사항 등록")
    public ApiResult<ConsultationInquiryRsp> postWebviewConsultationInquiry(
            @RequestBody ConsultationInquiryRequest request) {
        return new ApiResult<>(consultationInquiryService.create(request));
    }

    @PutMapping(path = "webview/consultation-inquiry/{seq}")
    @Operation(summary = "진찰시 문의사항 수정")
    public ApiResult<ConsultationInquiryRsp> putWebviewConsultationInquiry(
            @PathVariable Long seq,
            @RequestBody ConsultationInquiryRequest request) {
        return new ApiResult<>(consultationInquiryService.update(seq, request));
    }

    @PostMapping(path = "webview/consultation-inquiry/transmit")
    @Operation(summary = "진찰시 문의사항 전송완료 처리")
    public ApiResult<Integer> postWebviewConsultationInquiryTransmit(
            @RequestBody ConsultationInquiryTransmitRequest request) {
        return new ApiResult<>(consultationInquiryService.markTransmitted(request));
    }

    @DeleteMapping(path = "webview/consultation-inquiry/{seq}")
    @Operation(summary = "진찰시 문의사항 삭제")
    public ApiResult<Boolean> deleteWebviewConsultationInquiry(
            @PathVariable Long seq,
            @RequestParam Long acSeq) {
        return new ApiResult<>(consultationInquiryService.delete(seq, acSeq));
    }
}

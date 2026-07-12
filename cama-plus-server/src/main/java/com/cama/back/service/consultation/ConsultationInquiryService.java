package com.cama.back.service.consultation;

import com.cama.back.domain.consultation.AccountConsultationInquiry;
import com.cama.back.domain.consultation.AccountConsultationInquiryHistory;
import com.cama.back.domain.consultation.ConsultationInquiryActionType;
import com.cama.back.dto.consultation.ConsultationInquiryRequest;
import com.cama.back.dto.consultation.ConsultationInquiryRsp;
import com.cama.back.dto.consultation.ConsultationInquiryTransmitRequest;
import com.cama.back.exception.ConsultationInquiryLimitExceededException;
import com.cama.back.exception.ConsultationInquiryNotFoundException;
import com.cama.back.repo.consultation.ConsultationInquiryHistoryRepository;
import com.cama.back.repo.consultation.ConsultationInquiryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class ConsultationInquiryService {

    private final ConsultationInquiryRepository inquiryRepository;
    private final ConsultationInquiryHistoryRepository historyRepository;

    public ConsultationInquiryService(
            ConsultationInquiryRepository inquiryRepository,
            ConsultationInquiryHistoryRepository historyRepository) {
        this.inquiryRepository = inquiryRepository;
        this.historyRepository = historyRepository;
    }

    @Transactional(readOnly = true)
    public List<ConsultationInquiryRsp> listActive(Long accountSeq) {
        return inquiryRepository
                .findByAccountSeqAndEnabledOrderByCreatedAtDesc(accountSeq, true)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ConsultationInquiryRsp create(ConsultationInquiryRequest request) {
        validateRequest(request);

        Long accountSeq = request.getAcSeq();
        // 미전송(is_transmitted=false) 항목만 최대 5개 제한
        if (inquiryRepository.countByAccountSeqAndEnabledAndTransmitted(accountSeq, true, false)
                >= AccountConsultationInquiry.MAX_ACTIVE_COUNT) {
            throw new ConsultationInquiryLimitExceededException();
        }

        AccountConsultationInquiry inquiry = inquiryRepository.save(AccountConsultationInquiry.builder()
                .accountSeq(accountSeq)
                .title(request.getTitle().trim())
                .content(request.getContent().trim())
                .transmitted(false)
                .enabled(true)
                .build());

        saveHistory(inquiry, ConsultationInquiryActionType.CREATE);
        return toResponse(inquiry);
    }

    @Transactional
    public ConsultationInquiryRsp update(Long seq, ConsultationInquiryRequest request) {
        validateRequest(request);

        AccountConsultationInquiry inquiry = findActive(seq, request.getAcSeq());
        inquiry.setTitle(request.getTitle().trim());
        inquiry.setContent(request.getContent().trim());

        AccountConsultationInquiry saved = inquiryRepository.save(inquiry);
        saveHistory(saved, ConsultationInquiryActionType.UPDATE);
        return toResponse(saved);
    }

    @Transactional
    public boolean delete(Long seq, Long accountSeq) {
        AccountConsultationInquiry inquiry = findActive(seq, accountSeq);
        inquiry.setEnabled(false);
        inquiryRepository.save(inquiry);
        saveHistory(inquiry, ConsultationInquiryActionType.DELETE);
        return true;
    }

    /**
     * 의사앱 자료전송 성공 후 미전송 문의사항을 전송완료로 표시.
     */
    @Transactional
    public Integer markTransmitted(ConsultationInquiryTransmitRequest request) {
        if (request.getAcSeq() == null) {
            throw new IllegalArgumentException("acSeq is required");
        }
        if (CollectionUtils.isEmpty(request.getSeqs())) {
            return 0;
        }

        int updated = 0;
        List<AccountConsultationInquiryHistory> histories = new ArrayList<>();
        for (Long seq : request.getSeqs()) {
            if (seq == null) {
                continue;
            }
            AccountConsultationInquiry inquiry = inquiryRepository
                    .findBySeqAndAccountSeqAndEnabled(seq, request.getAcSeq(), true)
                    .orElse(null);
            if (inquiry == null || inquiry.isTransmitted()) {
                continue;
            }
            inquiry.setTransmitted(true);
            inquiryRepository.save(inquiry);
            histories.add(AccountConsultationInquiryHistory.builder()
                    .inquirySeq(inquiry.getSeq())
                    .accountSeq(inquiry.getAccountSeq())
                    .actionType(ConsultationInquiryActionType.TRANSMIT)
                    .title(inquiry.getTitle())
                    .content(inquiry.getContent())
                    .transmitted(true)
                    .build());
            updated++;
        }
        if (!histories.isEmpty()) {
            historyRepository.saveAll(histories);
        }
        return updated;
    }

    private AccountConsultationInquiry findActive(Long seq, Long accountSeq) {
        return inquiryRepository
                .findBySeqAndAccountSeqAndEnabled(seq, accountSeq, true)
                .orElseThrow(ConsultationInquiryNotFoundException::new);
    }

    private void validateRequest(ConsultationInquiryRequest request) {
        if (request.getAcSeq() == null) {
            throw new IllegalArgumentException("acSeq is required");
        }
        if (!StringUtils.hasText(request.getTitle())) {
            throw new IllegalArgumentException("title is required");
        }
        if (!StringUtils.hasText(request.getContent())) {
            throw new IllegalArgumentException("content is required");
        }
        if (request.getTitle().trim().length() > 200) {
            throw new IllegalArgumentException("title is too long");
        }
    }

    private void saveHistory(
            AccountConsultationInquiry inquiry,
            ConsultationInquiryActionType actionType) {
        historyRepository.save(AccountConsultationInquiryHistory.builder()
                .inquirySeq(inquiry.getSeq())
                .accountSeq(inquiry.getAccountSeq())
                .actionType(actionType)
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .transmitted(inquiry.isTransmitted())
                .build());
    }

    private ConsultationInquiryRsp toResponse(AccountConsultationInquiry inquiry) {
        return ConsultationInquiryRsp.builder()
                .seq(inquiry.getSeq())
                .accountSeq(inquiry.getAccountSeq())
                .title(inquiry.getTitle())
                .content(inquiry.getContent())
                .transmitted(inquiry.isTransmitted())
                .createdAt(inquiry.getCreatedAt())
                .updatedAt(inquiry.getUpdatedAt())
                .build();
    }
}

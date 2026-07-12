package com.cama.back.repo.consultation;

import com.cama.back.domain.consultation.AccountConsultationInquiry;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsultationInquiryRepository extends JpaRepository<AccountConsultationInquiry, Long> {

    List<AccountConsultationInquiry> findByAccountSeqAndEnabledOrderByCreatedAtDesc(Long accountSeq, boolean enabled);

    long countByAccountSeqAndEnabledAndTransmitted(Long accountSeq, boolean enabled, boolean transmitted);

    Optional<AccountConsultationInquiry> findBySeqAndAccountSeqAndEnabled(Long seq, Long accountSeq, boolean enabled);
}

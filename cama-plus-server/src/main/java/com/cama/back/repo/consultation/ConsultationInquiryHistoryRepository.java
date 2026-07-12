package com.cama.back.repo.consultation;

import com.cama.back.domain.consultation.AccountConsultationInquiryHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ConsultationInquiryHistoryRepository extends JpaRepository<AccountConsultationInquiryHistory, Long> {
}

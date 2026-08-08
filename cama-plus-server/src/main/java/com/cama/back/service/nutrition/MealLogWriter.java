package com.cama.back.service.nutrition;

import com.cama.back.domain.nutrition.AccountMealLog;
import com.cama.back.repo.nutrition.MealLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

/**
 * 신규 식사 기록 삽입 전용.
 * <p>
 * (account_seq, client_log_id) 유니크 위반을 호출자가 잡아 기존 행을 돌려줄 수 있어야 하므로
 * 별도 트랜잭션에서 즉시 flush 한다. 조회 후 삽입 방식은 동시 요청에서 중복을 만든다.
 */
@Component
@RequiredArgsConstructor
public class MealLogWriter {

    private final MealLogRepository mealLogRepository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public AccountMealLog insert(AccountMealLog mealLog) {
        return mealLogRepository.saveAndFlush(mealLog);
    }
}

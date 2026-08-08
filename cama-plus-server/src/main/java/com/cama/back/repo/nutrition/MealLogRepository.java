package com.cama.back.repo.nutrition;

import com.cama.back.domain.nutrition.AccountMealLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface MealLogRepository extends JpaRepository<AccountMealLog, Long> {

    @Query("""
            select distinct l from AccountMealLog l
             left join fetch l.items
             where l.accountSeq = :accountSeq
               and l.clientLogId = :clientLogId
            """)
    Optional<AccountMealLog> findDetailByClientLogId(@Param("accountSeq") Long accountSeq,
                                                     @Param("clientLogId") String clientLogId);

    @Query("""
            select distinct l from AccountMealLog l
             left join fetch l.items
             where l.seq = :seq
               and l.accountSeq = :accountSeq
               and l.enabled = true
            """)
    Optional<AccountMealLog> findDetailBySeq(@Param("seq") Long seq,
                                            @Param("accountSeq") Long accountSeq);

    Optional<AccountMealLog> findBySeqAndAccountSeqAndEnabled(Long seq, Long accountSeq, boolean enabled);
}

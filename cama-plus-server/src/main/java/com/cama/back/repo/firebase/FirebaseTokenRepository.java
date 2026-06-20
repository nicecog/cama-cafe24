package com.cama.back.repo.firebase;


import com.cama.back.domain.firebase.FirebaseToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface FirebaseTokenRepository extends JpaRepository<FirebaseToken, Long> {

    Optional<FirebaseToken> findByAccountSeqAndEnabled(Long accountSeq, boolean enabled);

    /** 관리자 FCM: 활성 유효 토큰 우선, 없으면 최근 비활성 유효 토큰 */
    @Query(value = """
            SELECT * FROM firebase_token
            WHERE account_seq = :accountSeq
              AND token IS NOT NULL
              AND btrim(token) <> ''
              AND token NOT IN ('test', 'web-no-fcm')
              AND length(token) > 10
            ORDER BY is_enabled DESC, updated_at DESC
            LIMIT 1
            """, nativeQuery = true)
    Optional<FirebaseToken> findBestDeliverableToken(@Param("accountSeq") Long accountSeq);

}

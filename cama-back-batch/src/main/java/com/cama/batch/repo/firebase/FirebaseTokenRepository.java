package com.cama.batch.repo.firebase;


import com.cama.batch.domain.firebase.FirebaseToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FirebaseTokenRepository extends JpaRepository<FirebaseToken, Long> {

    Optional<FirebaseToken> findByAccountSeqAndEnabled(Long accountSeq, boolean enabled);

}

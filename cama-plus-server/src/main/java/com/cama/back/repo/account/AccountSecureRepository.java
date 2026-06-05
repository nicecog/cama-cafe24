package com.cama.back.repo.account;


import com.cama.back.domain.account.AccountSecure;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AccountSecureRepository extends JpaRepository<AccountSecure, Long> {

    Optional<AccountSecure> findBySecureCodeAndEnabled(String loginId, boolean enabled);

}

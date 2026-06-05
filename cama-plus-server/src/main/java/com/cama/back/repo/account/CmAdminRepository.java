package com.cama.back.repo.account;


import com.cama.back.domain.admin.CmAdmin;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CmAdminRepository extends JpaRepository<CmAdmin, Long> {

    Optional<CmAdmin> findByLoginIdAndEnabled(String loginId, boolean enabled);

}

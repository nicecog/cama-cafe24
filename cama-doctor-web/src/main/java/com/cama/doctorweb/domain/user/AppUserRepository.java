package com.cama.doctorweb.domain.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    Optional<AppUser> findByFirebaseUid(String firebaseUid);
}

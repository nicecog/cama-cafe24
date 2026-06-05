package com.cama.back.repo.account;


import com.cama.back.domain.account.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Long> {

    Optional<Account> findByLoginIdAndEnabledAndDropped(String loginId, boolean enabled, boolean dropped);

    Optional<Account> findByEmailAndEnabledAndDropped(String email, boolean enabled, boolean dropped);

    Optional<Account> findByNameAndPhoneAndEnabledAndDropped(String name, String phone, boolean enabled, boolean dropped);

    Optional<Account> findByEmailAndNameAndPhoneAndEnabledAndDropped(String email, String name, String phone, boolean enabled, boolean dropped);

    boolean existsByLoginIdAndEnabledAndDropped(String loginId, boolean enabled, boolean dropped);

    boolean existsByEmailAndEnabledAndDropped(String email, boolean enabled, boolean dropped);

    Optional<Account> findByPatientManagementNumberAndEnabledAndDropped(String patientManagementNumber, boolean enabled, boolean dropped);

    boolean existsByPatientManagementNumberAndEnabledAndDropped(String patientManagementNumber, boolean enabled, boolean dropped);

    Optional<Account> findByPhoneAndEnabledAndDropped(String phone, boolean enabled, boolean dropped);

    boolean existsByPhoneAndEnabledAndDropped(String phone, boolean enabled, boolean dropped);

    @Query(value = """
            SELECT login_id FROM account
            WHERE name = :name AND phone = :phone AND is_enabled = true AND is_dropped = false
            ORDER BY seq DESC
            LIMIT 1
            """, nativeQuery = true)
    Optional<String> findLoginIdByNameAndPhone(@Param("name") String name, @Param("phone") String phone);

    @Query(value = """
            SELECT password FROM account
            WHERE login_id = :loginId AND is_enabled = true AND is_dropped = false
            """, nativeQuery = true)
    Optional<String> findPasswordHashByLoginId(@Param("loginId") String loginId);

    @Query(value = """
            SELECT password FROM account
            WHERE email = :email AND is_enabled = true AND is_dropped = false
            """, nativeQuery = true)
    Optional<String> findPasswordHashByEmail(@Param("email") String email);

    @Query("""
            SELECT a.seq AS seq, a.loginId AS loginId, a.nickName AS nickName, a.name AS name, a.signType AS signType
            FROM Account a
            WHERE a.loginId = :loginId AND a.enabled = true AND a.dropped = false
            """)
    Optional<AccountAuthInfo> findAuthInfoByLoginId(@Param("loginId") String loginId);

    @Query("""
            SELECT a.seq AS seq, a.loginId AS loginId, a.nickName AS nickName, a.name AS name, a.signType AS signType
            FROM Account a
            WHERE a.email = :email AND a.enabled = true AND a.dropped = false
            """)
    Optional<AccountAuthInfo> findAuthInfoByEmail(@Param("email") String email);

    @Query(value = "SELECT roles FROM account_roles WHERE account_seq = :seq", nativeQuery = true)
    List<String> findRoleNamesByAccountSeq(@Param("seq") Long seq);

    @Query("""
            SELECT a.seq AS seq, a.email AS email, a.signType AS signType, a.name AS name
            FROM Account a
            WHERE a.name = :name AND a.phone = :phone AND a.enabled = true AND a.dropped = false
            ORDER BY a.seq DESC
            """)
    List<AccountRecoveryInfo> findRecoveryInfoListByNameAndPhone(
            @Param("name") String name,
            @Param("phone") String phone);

    @Query("""
            SELECT a.seq AS seq, a.email AS email, a.signType AS signType, a.name AS name
            FROM Account a
            WHERE a.loginId = :loginId AND a.name = :name AND a.phone = :phone
            AND a.enabled = true AND a.dropped = false
            ORDER BY a.seq DESC
            """)
    List<AccountRecoveryInfo> findRecoveryInfoListByLoginIdNameAndPhone(
            @Param("loginId") String loginId,
            @Param("name") String name,
            @Param("phone") String phone);

    @Query("UPDATE Account a SET a.password = :password WHERE a.seq = :seq")
    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true, flushAutomatically = true)
    void updatePasswordBySeq(@Param("seq") Long seq, @Param("password") String password);

    @Query("UPDATE Account a SET a.loginId = :loginId WHERE a.seq = :seq")
    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true, flushAutomatically = true)
    void updateLoginIdBySeq(@Param("seq") Long seq, @Param("loginId") String loginId);

    @Query("SELECT COUNT(a) FROM Account a WHERE a.seq = :seq AND a.loginId = :loginId")
    long countBySeqAndLoginId(@Param("seq") Long seq, @Param("loginId") String loginId);

}

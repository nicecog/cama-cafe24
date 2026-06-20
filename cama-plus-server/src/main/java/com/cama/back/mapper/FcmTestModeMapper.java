package com.cama.back.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface FcmTestModeMapper {

    void ensureBackupTable();

    void ensureTestModeTable();

    int countActiveBackupSession();

    String findActiveSessionId();

    int backupEnabledBatchSchedules(@Param("sessionId") String sessionId);

    int disableEnabledBatchSchedules();

    int restoreBatchSchedules(@Param("sessionId") String sessionId);

    int deleteBackupSession(@Param("sessionId") String sessionId);

    void insertTestModeSession(@Param("sessionId") String sessionId, @Param("backedUpCount") int backedUpCount);

    void deleteTestModeSession(@Param("sessionId") String sessionId);

    FcmTestModeRow findActiveTestMode();
}

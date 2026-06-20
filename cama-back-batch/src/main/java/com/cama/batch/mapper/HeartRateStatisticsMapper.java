package com.cama.batch.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

@Mapper
@Repository
public interface HeartRateStatisticsMapper {

    /**
     * 전일(또는 지정일) HEART_RATE 원시 데이터를 계정별 일 통계로 upsert.
     *
     * @param statDate yyyy-MM-dd (KST 기준 집계일)
     * @return upsert 된 행 수
     */
    int upsertDailyStatistics(@Param("statDate") String statDate);
}

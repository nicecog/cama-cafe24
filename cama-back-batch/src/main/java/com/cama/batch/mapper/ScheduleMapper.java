package com.cama.batch.mapper;

import com.cama.batch.dto.batch.BatchRsp;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Repository;

import java.util.List;

@Mapper
@Repository
public interface ScheduleMapper {

    List<BatchRsp> getScheduleBatchList();
    List<BatchRsp> getScheduleBatchList2();
    List<BatchRsp> getScheduleBatchList3();
    List<BatchRsp> getScheduleBatchList4();
    List<BatchRsp> getScheduleBatchList5();
    List<BatchRsp> getScheduleBatchList6();
    List<BatchRsp> getScheduleBatchList11(String categoryCd);

    int getExistStatistics(String userTypeCd);
    int getUserCnt(String userTypeCd);
    int getDayEnableCnt(String userTypeCd);
    int getMonthEnableCnt(String userTypeCd);
    
    int updateAcctStatistics(String userTypeCd, int userCnt, int dayEnableCnt, int monthEnableCnt);  
    int insertAcctStatistics(String userTypeCd, int userCnt, int dayEnableCnt, int monthEnableCnt);

}

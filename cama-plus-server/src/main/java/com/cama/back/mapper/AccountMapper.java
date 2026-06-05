package com.cama.back.mapper;

import com.cama.back.dto.SearchParam;
import com.cama.back.dto.account.ActiveHospitalRsp;
import com.cama.back.dto.account.RecentNotificationRsp;
import com.cama.back.dto.admin.AdminAccountRsp;
import com.cama.back.dto.disease.DiseaseAllNameRsp;
import com.cama.back.dto.disease.DiseaseNameRsp;
import com.cama.back.dto.disease.DiseaseRsp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Mapper
@Repository
public interface AccountMapper {

    int getAdminAccountListCount(SearchParam searchParam);

    List<AdminAccountRsp> getAdminAccountList(SearchParam searchParam);

    Optional<AdminAccountRsp> getAdminAccountView(@Param("seq") Long seq);

    int getAdminMemberListCount(SearchParam searchParam);

    List<AdminAccountRsp> getAdminMemberList(SearchParam searchParam);

    List<DiseaseNameRsp> getDiseaseNameList(@Param("acSeq") Long acSeq, @Param("hSeq") Long hSeq);

    List<DiseaseAllNameRsp> getDiseaseNameAllList(@Param("acSeq") Long acSeq, @Param("hSeq") Long hSeq);

    List<DiseaseRsp> getDiseaseList(@Param("acSeq") Long acSeq, @Param("hSeq") Long hSeq);

    int getRecentNotificationCount(SearchParam searchParam);

    List<RecentNotificationRsp> getRecentNotification(SearchParam searchParam);

    //
    Optional<ActiveHospitalRsp> getActiveHospital(@Param("acSeq") Long acSeq);
    
    int insertAccountSearchHst(SearchParam searchParam);
    
    int insertAccountLoginHst(@Param("acSeq") Long acSeq);
    
    int insertAccountLogoutHst(@Param("acSeq") Long acSeq);

}

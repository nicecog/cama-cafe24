package com.cama.back.mapper;

import com.cama.back.dto.SearchParam;
import com.cama.back.dto.account.AccountHospitalRsp;
import com.cama.back.dto.hospital.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Mapper
@Repository
public interface HospitalMapper {

    int getAdminHospitalListCount(SearchParam searchParam);

    List<HospitalRsp> getAdminHospitalList(SearchParam searchParam);

    int getHospitalListCount(SearchParam searchParam);

    List<HospitalRsp> getHospitalList(SearchParam searchParam);

    Optional<HospitalRsp> getHospitalDetail(@Param("seq") Long seq);

    List<HospitalDoctorRsp> getHospitalDoctorList(@Param("seq") Long seq);

    Optional<AccountHospitalRsp> getMyHospitalInfo(@Param("acSeq") Long acSeq);

    List<HpDiseaseRsp> getHospitalDiseaseList(@Param("hSeq") Long hSeq, @Param("type") String type);

    List<HpDiseaseOptionRsp> getHospitalDiseaseOptionList(@Param("seq") Long seq);

    List<HpTreatmentRsp> getHospitalDiseaseTreatmentList(@Param("seq") Long seq);

}

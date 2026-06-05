package com.cama.back.mapper;

import com.cama.back.dto.SearchParam;
import com.cama.back.dto.doctor.DoctorRsp;
import com.cama.back.dto.doctor.ServiceRsp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Mapper
@Repository
public interface DoctorMapper {

    int getAdminDoctorListCount(SearchParam searchParam);

    List<DoctorRsp> getAdminDoctorList(SearchParam searchParam);

    Optional<DoctorRsp> getDoctorDetail(@Param("seq") Long seq);

    int getServiceListCount(SearchParam searchParam);

    List<ServiceRsp> getServiceList(SearchParam searchParam);

    Optional<ServiceRsp> getServiceDetail(@Param("seq") Long seq, @Param("hospitalSeq") Long hospitalSeq);

    //

}

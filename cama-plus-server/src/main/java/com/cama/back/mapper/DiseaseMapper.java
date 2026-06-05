package com.cama.back.mapper;

import com.cama.back.dto.SearchParam;
import com.cama.back.dto.disease.AdminDiseaseRsp;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Mapper
@Repository
public interface DiseaseMapper {

    int getAdminHpDiseaseListCount(SearchParam searchParam);

    List<AdminDiseaseRsp> getAdminHpDiseaseList(SearchParam searchParam);

    Optional<AdminDiseaseRsp> getAdminHpDiseaseDetail(@Param("seq") Long seq);

}

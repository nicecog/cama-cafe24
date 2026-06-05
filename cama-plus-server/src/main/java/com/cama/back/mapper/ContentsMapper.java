package com.cama.back.mapper;

import com.cama.back.domain.contents.CmContentsVideo;
import com.cama.back.domain.wellbeing.CmWellbeingResources;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.doctor.ContentsFavorite;
import com.cama.back.dto.doctor.ContentsRsp;
import com.cama.back.dto.doctor.ServiceRsp;
import com.cama.back.dto.wellbeing.WellbeingResource;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;
import com.cama.back.dto.doctor.ContentsRsp;

import java.util.List;
import java.util.Optional;

@Mapper
@Repository
public interface ContentsMapper {

    int getDoneContentsCount();

    int getIngContentsCount();

    int getPatientContentsCount(@Param("dSeq") Long dSeq);

    int getContentsListCount(SearchParam searchParam);

    List<ContentsRsp> getContentsList(SearchParam searchParam);

    int getDoctorContentsListCount(SearchParam searchParam);

    List<ContentsRsp> getDoctorContentsList(SearchParam searchParam);

    int getContentDisablesListCount(SearchParam searchParam);

    List<ContentsRsp> getContentDisablesList(SearchParam searchParam);

    Optional<ContentsRsp> getContentsDetail(@Param("seq") Long seq);

    Optional<ContentsRsp> getDoctorContentsDetail(@Param("seq") Long seq);

    Optional<ContentsRsp> getTrackContentsDetail(@Param("seq") Long seq,
                                                 @Param("acSeq") Long acSeq,
                                                 @Param("trackSeq") Long trackSeq);

    Optional<ContentsRsp> getTrackContentsNatureDetail(@Param("seq") Long seq,
                                                       @Param("acSeq") Long acSeq,
                                                       @Param("trackSeq") Long trackSeq);

    //

    int getServiceListCount(SearchParam searchParam);

    List<ServiceRsp> getServiceList(SearchParam searchParam);

    Optional<ServiceRsp> getServiceDetail(@Param("seq") Long seq);

    //
    
    List<CmContentsVideo> getCmVideoInfoList(CmContentsVideo cmContentsVideo);
    
    List<CmContentsVideo> getCmVideoInfoMobileList(CmContentsVideo cmContentsVideo);
   
    int getCmVideoCnt(CmContentsVideo cmContentsVideo);
    
    int updateCmVideo(CmContentsVideo cmContentsVideo);
    
    int insertCmVideo(CmContentsVideo cmContentsVideo);
    
    List<ContentsRsp> getCareTrackContentsList(
    		@Param("disease") Long disease,
            @Param("diseaseTreatmentSeq") Long diseaseTreatmentSeq
            );
 
    List<ContentsRsp> getCareTrackGeneralCancerContentsList(
    		@Param("disease") Long disease
            );
    
    List<ContentsRsp> getCareTrackContentsInterList(
    		@Param("disease") Long disease,
            @Param("diseaseTreatmentSeq") Long diseaseTreatmentSeq,
            @Param("interest") List<String> interest
            );
    
    List<ContentsRsp> getFavoriteList(SearchParam searchParam);
    
    int updateFavorite(ContentsFavorite contentsFavorite);
    
    int insertFavorite(ContentsFavorite contentsFavorite);
    
    int getWellbeingResourceListCount(SearchParam searchParam);

    List<WellbeingResource> getWellbeingResourceList(SearchParam searchParam);
    
    Optional<WellbeingResource> getWellbeingResourceDetail(@Param("seq") Long seq);

}

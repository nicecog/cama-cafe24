package com.cama.back.controller.common;

import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.disease.CmDisease;
import com.cama.back.domain.disease.CmDiseaseDetail;
import com.cama.back.dto.hospital.HpDiseaseRsp;
import com.cama.back.mapper.HospitalMapper;
import com.cama.back.repo.disease.CmDiseaseDetailRepository;
import com.cama.back.repo.disease.CmDiseaseRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api")
@Tag(name = "공통 데이타 APIs")
public class CommonRestController {

    private final CmDiseaseRepository cmDiseaseRepository;
    private final CmDiseaseDetailRepository cmDiseaseDetailRepository;
    private final HospitalMapper hospitalMapper;

    public CommonRestController(CmDiseaseRepository cmDiseaseRepository,
                                CmDiseaseDetailRepository cmDiseaseDetailRepository,
                                HospitalMapper hospitalMapper) {
        this.cmDiseaseRepository = cmDiseaseRepository;
        this.cmDiseaseDetailRepository = cmDiseaseDetailRepository;
        this.hospitalMapper = hospitalMapper;
    }


//    @PostMapping("common/care/time/type")
//    @Operation(summary = "암치료 시기")
//    public ApiResult<List<CareTimeType>> getCommonCareTimeType() {
//        List<CareTimeType> list = careTimeTypeRepository.findByEnabledOrderBySeq(true);
//        return new ApiResult<>(list);
//    }

    @GetMapping("common/disease/list")
    @Operation(summary = "질병 리스트")
    public ApiResult<List<CmDisease>> getCommonDiseaseList() {
        List<CmDisease> list = cmDiseaseRepository.findByEnabledOrderBySeqDesc(true);
        return new ApiResult<>(list);
    }
    
    @GetMapping("webview/common/disease/list")
    @Operation(summary = "질병 리스트")
    public ApiResult<List<CmDisease>> getWebviewCommonDiseaseList() {
        List<CmDisease> list = cmDiseaseRepository.findByEnabledOrderBySeqDesc(true);
        return new ApiResult<>(list);
    }

    @GetMapping(path = "common/hospital/{hSeq}/disease/list/{type}")
    @Operation(summary = "병원 질병 리스트")
    public ApiResult<List<HpDiseaseRsp>> getDoctorHospitalDiseaseList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                      @PathVariable Long hSeq,
                                                                      @PathVariable String type) {
    	//System.out.println(" type = > " + type);
        List<HpDiseaseRsp> list = hospitalMapper.getHospitalDiseaseList(hSeq,type);

        List<HpDiseaseRsp> collect = list.stream().peek(s -> {
            s.setDiseaseTreatment(hospitalMapper.getHospitalDiseaseTreatmentList(s.getSeq()));
            s.setDiseaseOption(hospitalMapper.getHospitalDiseaseOptionList(s.getSeq()));
        }).collect(Collectors.toList());

        return new ApiResult<>(collect);

    }

    @GetMapping("common/disease/{hospitalSeq}/detail/list")
    @Operation(summary = "질병 상세 리스트(병원별)")
    public ApiResult<List<CmDiseaseDetail>> getCommonDiseaseDetailList(@PathVariable Long hospitalSeq) {
        List<CmDiseaseDetail> list =
                cmDiseaseDetailRepository.findByHospitalSeqAndEnabledOrderBySeqDesc(hospitalSeq, true);
        return new ApiResult<>(list);
    }

}

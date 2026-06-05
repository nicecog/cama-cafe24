package com.cama.back.controller.hospital;


import com.cama.back.domain.account.Account;
import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.hospital.HospitalService;
import com.cama.back.domain.hospital.ServiceStatus;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.hospital.HospitalDoctorRsp;
import com.cama.back.dto.hospital.HospitalRsp;
import com.cama.back.dto.hospital.HospitalServiceRequest;
import com.cama.back.dto.hospital.HpDiseaseRsp;
import com.cama.back.exception.hospital.HospitalNotFoundException;
import com.cama.back.mapper.AccountMapper;
import com.cama.back.mapper.HospitalMapper;
import com.cama.back.repo.hospital.HospitalServiceRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api")
@Tag(name = "병원 & 의사 APIs")
public class HospitalRestController {

    private final HospitalMapper hospitalMapper;
    private final AccountMapper accountMapper;
    private final HospitalServiceRepository hospitalServiceRepository;

    public HospitalRestController(HospitalMapper hospitalMapper, AccountMapper accountMapper, HospitalServiceRepository hospitalServiceRepository) {
        this.hospitalMapper = hospitalMapper;
        this.accountMapper = accountMapper;
        this.hospitalServiceRepository = hospitalServiceRepository;
    }

    @GetMapping(path = "hospital/{hSeq}/disease/list")
    @Operation(summary = "병원 질병 리스트")
    public ApiResult<List<HpDiseaseRsp>> getHospitalDiseaseList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                @PathVariable Long hSeq) {

        List<HpDiseaseRsp> list = hospitalMapper.getHospitalDiseaseList(hSeq,"B");

        List<HpDiseaseRsp> collect = list.stream().peek(s -> {
            s.setDiseaseTreatment(hospitalMapper.getHospitalDiseaseTreatmentList(s.getSeq()));
            s.setDiseaseOption(hospitalMapper.getHospitalDiseaseOptionList(s.getSeq()));
        }).collect(Collectors.toList());

        return new ApiResult<>(collect);

    }

    @GetMapping(path = "webview/hospital/{hSeq}/disease/list")
    @Operation(summary = "병원 질병 리스트")
    public ApiResult<List<HpDiseaseRsp>> getWebviewHospitalDiseaseList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                @PathVariable Long hSeq) {

        List<HpDiseaseRsp> list = hospitalMapper.getHospitalDiseaseList(hSeq,"B");

        List<HpDiseaseRsp> collect = list.stream().peek(s -> {
            s.setDiseaseTreatment(hospitalMapper.getHospitalDiseaseTreatmentList(s.getSeq()));
            s.setDiseaseOption(hospitalMapper.getHospitalDiseaseOptionList(s.getSeq()));
        }).collect(Collectors.toList());

        return new ApiResult<>(collect);

    }

    @GetMapping(path = "hospital/list")
    @Operation(summary = "병원 리스트")
    public ApiResult<List<HospitalRsp>> getHospitalList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                        SearchParam searchParam) {

        int totalCount = hospitalMapper.getHospitalListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<HospitalRsp> list = hospitalMapper.getHospitalList(searchParam);

        return new ApiResult<>(list, pagination);

    }

    @GetMapping(path = "webview/hospital/list")
    @Operation(summary = "병원 리스트")
    public ApiResult<List<HospitalRsp>> getWebviewHospitalList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                        SearchParam searchParam) {

        int totalCount = hospitalMapper.getHospitalListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<HospitalRsp> list = hospitalMapper.getHospitalList(searchParam);

        return new ApiResult<>(list, pagination);

    }

    @GetMapping(path = "hospital/{seq}/view")
    @Operation(summary = "병원 상세")
    public ApiResult<HospitalRsp> getHospitalDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                    @PathVariable Long seq) {

        if (!hospitalMapper.getHospitalDetail(seq).isPresent()) {
            throw new HospitalNotFoundException();
        }

        HospitalRsp rsp = hospitalMapper.getHospitalDetail(seq).get();

        return new ApiResult<>(rsp);

    }

    @GetMapping(path = "hospital/{seq}/doctor/list")
    @Operation(summary = "병원 의사 리스트")
    public ApiResult<List<HospitalDoctorRsp>> getHospitalDoctorList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                    @PathVariable Long seq) {

        if (!hospitalMapper.getHospitalDetail(seq).isPresent()) {
            throw new HospitalNotFoundException();
        }

        List<HospitalDoctorRsp> list = hospitalMapper.getHospitalDoctorList(seq);
        return new ApiResult<>(list);

    }

    @GetMapping(path = "webview/hospital/{seq}/doctor/list")
    @Operation(summary = "병원 의사 리스트")
    public ApiResult<List<HospitalDoctorRsp>> getWebviewHospitalDoctorList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                    @PathVariable Long seq) {

        if (!hospitalMapper.getHospitalDetail(seq).isPresent()) {
            throw new HospitalNotFoundException();
        }

        List<HospitalDoctorRsp> list = hospitalMapper.getHospitalDoctorList(seq);
        return new ApiResult<>(list);

    }


    @PostMapping(path = "hospital/service/apply")
    @Operation(summary = "병원 서비스 신청")
    public ApiResult<Boolean> postHospitalServiceApply(@AuthenticationPrincipal JwtAuthentication authentication,
                                                       @RequestBody HospitalServiceRequest dto) {

        Long acSeq = authentication.id.value();
        Long hospitalSeq = dto.getHospitalSeq();

        hospitalServiceRepository.save(HospitalService.builder()
                .accountSeq(acSeq)
                .hospitalSeq(hospitalSeq)
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PostMapping(path = "webview/hospital/service/apply")
    @Operation(summary = "병원 서비스 신청")
    public ApiResult<Boolean> postWebviewHospitalServiceApply(@AuthenticationPrincipal JwtAuthentication authentication,
                                                       @RequestBody HospitalServiceRequest dto) {

        Long acSeq = dto.getAcSeq();
        Long hospitalSeq = dto.getHospitalSeq();

        hospitalServiceRepository.save(HospitalService.builder()
                .accountSeq(acSeq)
                .hospitalSeq(hospitalSeq)
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PostMapping(path = "hospital/service/check")
    @Operation(summary = "병원 서비스 신청 확인")
    public ApiResult<ServiceStatus> postHospitalServiceCheck(@AuthenticationPrincipal JwtAuthentication authentication) {

        Long acSeq = authentication.id.value();

        if (!accountMapper.getActiveHospital(acSeq).isPresent()) {
            return new ApiResult<>(ServiceStatus.NOT_SERVICE);
        } else {
            return new ApiResult<>(ServiceStatus.APPROVE);
        }

    }

    @PostMapping(path = "webview/hospital/service/check")
    @Operation(summary = "병원 서비스 신청 확인")
    public ApiResult<ServiceStatus> postWebviewHospitalServiceCheck(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody Account dto) {
    	
        Long acSeq = dto.getSeq();

        if (!accountMapper.getActiveHospital(acSeq).isPresent()) {
            return new ApiResult<>(ServiceStatus.NOT_SERVICE);
        } else {
            return new ApiResult<>(ServiceStatus.APPROVE);
        }

    }

}

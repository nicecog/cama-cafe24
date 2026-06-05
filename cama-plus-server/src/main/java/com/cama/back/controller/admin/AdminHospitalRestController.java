package com.cama.back.controller.admin;


import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.doctor.CmDoctor;
import com.cama.back.domain.hospital.CmHospital;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.hospital.HospitalRequest;
import com.cama.back.dto.hospital.HospitalRsp;
import com.cama.back.exception.hospital.HospitalNotFoundException;
import com.cama.back.mapper.HospitalMapper;
import com.cama.back.repo.doctor.CmDoctorRepository;
import com.cama.back.repo.hospital.CmHospitalRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/admin")
@Tag(name = "[Foundation]관리자 병원 APIs")
public class AdminHospitalRestController {

    private final CmHospitalRepository cmHospitalRepository;
    private final CmDoctorRepository cmDoctorRepository;
    private final HospitalMapper hospitalMapper;

    public AdminHospitalRestController(CmHospitalRepository cmHospitalRepository, CmDoctorRepository cmDoctorRepository, HospitalMapper hospitalMapper) {
        this.cmHospitalRepository = cmHospitalRepository;
        this.cmDoctorRepository = cmDoctorRepository;
        this.hospitalMapper = hospitalMapper;
    }

    @GetMapping(path = "hospital/list")
    @Operation(summary = "병원 리스트")
    public ApiResult<List<HospitalRsp>> getAdminHospitalList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                             SearchParam searchParam) {

        int totalCount = hospitalMapper.getAdminHospitalListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<HospitalRsp> list = hospitalMapper.getAdminHospitalList(searchParam);

        return new ApiResult<>(list, pagination);

    }

    @GetMapping(path = "hospital/{seq}/view")
    @Operation(summary = "병원 상세")
    public ApiResult<HospitalRsp> getAdminHospitalDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                         @PathVariable Long seq) {

        if (!hospitalMapper.getHospitalDetail(seq).isPresent()) {
            throw new HospitalNotFoundException();
        }

        HospitalRsp hospitalRsp = hospitalMapper.getHospitalDetail(seq).get();
        return new ApiResult<>(hospitalRsp);

    }

    @PostMapping(path = "hospital")
    @Operation(summary = "병원 등록")
    public ApiResult<Boolean> postAdminHospital(@AuthenticationPrincipal JwtAuthentication authentication,
                                                @RequestBody HospitalRequest dto) {

        cmHospitalRepository.save(CmHospital.builder()
                .name(dto.getName())
                .corpNumber(dto.getCorpNumber())
                .address(dto.getAddress())
                .homepage(dto.getHomepage())
                .profName(dto.getProfName())
                .profMajor(dto.getProfMajor())
                .profEmail(dto.getProfEmail())
                .profPhone(dto.getProfPhone())
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PutMapping(path = "hospital/{seq}/view")
    @Operation(summary = "병원 수정")
    public ApiResult<Boolean> putAdminHospital(@AuthenticationPrincipal JwtAuthentication authentication,
                                               @PathVariable Long seq,
                                               @RequestBody HospitalRequest dto) {

        if (!cmHospitalRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new HospitalNotFoundException();
        }

        CmHospital hospital = cmHospitalRepository.findBySeqAndEnabled(seq, true).get();

        hospital.setName(dto.getName());
        hospital.setCorpNumber(dto.getCorpNumber());
        hospital.setAddress(dto.getAddress());
        hospital.setHomepage(dto.getHomepage());
        hospital.setProfName(dto.getProfName());
        hospital.setProfMajor(dto.getProfMajor());
        hospital.setProfEmail(dto.getProfEmail());
        hospital.setProfPhone(dto.getProfPhone());

        cmHospitalRepository.save(hospital);

        return new ApiResult<>(true);

    }

    @DeleteMapping(path = "hospital/{seq}/view")
    @Operation(summary = "병원 삭제")
    public ApiResult<Boolean> deleteAdminHospital(@AuthenticationPrincipal JwtAuthentication authentication,
                                                  @PathVariable Long seq) {

        if (!cmHospitalRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new HospitalNotFoundException();
        }

        CmHospital hospital = cmHospitalRepository.findBySeqAndEnabled(seq, true).get();

        hospital.setEnabled(false);

        cmHospitalRepository.save(hospital);

        Long hSeq = hospital.getSeq();
        // 병원 하위에 있는 의사도 삭제
        List<CmDoctor> list = cmDoctorRepository.findByHospitalSeqAndEnabled(hSeq, true);
        List<CmDoctor> collect = list.stream().peek(s -> s.setEnabled(false)).collect(Collectors.toList());
        cmDoctorRepository.saveAll(collect);

        return new ApiResult<>(true);

    }


}

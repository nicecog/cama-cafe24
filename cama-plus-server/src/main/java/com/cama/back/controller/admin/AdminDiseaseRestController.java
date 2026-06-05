package com.cama.back.controller.admin;


import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.hospital.HpDisease;
import com.cama.back.domain.hospital.HpDiseaseOption;
import com.cama.back.domain.hospital.HpDiseaseTreatment;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.disease.*;
import com.cama.back.exception.disease.AlreadyDiseaseDuplicateException;
import com.cama.back.exception.disease.DiseaseNotFoundException;
import com.cama.back.mapper.DiseaseMapper;
import com.cama.back.repo.disease.HpDiseaseOptionRepository;
import com.cama.back.repo.disease.HpDiseaseRepository;
import com.cama.back.repo.disease.HpDiseaseTreatmentRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/admin")
@Tag(name = "[Foundation]관리자 질환 기준정보 APIs")
public class AdminDiseaseRestController {

    private final HpDiseaseRepository hpDiseaseRepository;
    private final HpDiseaseOptionRepository hpDiseaseOptionRepository;
    private final HpDiseaseTreatmentRepository hpDiseaseTreatmentRepository;
    private final DiseaseMapper diseaseMapper;

    public AdminDiseaseRestController(HpDiseaseRepository hpDiseaseRepository, HpDiseaseOptionRepository hpDiseaseOptionRepository,
                                      HpDiseaseTreatmentRepository hpDiseaseTreatmentRepository, DiseaseMapper diseaseMapper) {
        this.hpDiseaseRepository = hpDiseaseRepository;
        this.hpDiseaseOptionRepository = hpDiseaseOptionRepository;
        this.hpDiseaseTreatmentRepository = hpDiseaseTreatmentRepository;
        this.diseaseMapper = diseaseMapper;
    }

    @GetMapping(path = "disease/list")
    @Operation(summary = "질환 리스트")
    public ApiResult<List<AdminDiseaseRsp>> getAdminDiseaseList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                SearchParam searchParam) {

        int totalCount = diseaseMapper.getAdminHpDiseaseListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<AdminDiseaseRsp> list = diseaseMapper.getAdminHpDiseaseList(searchParam);

        return new ApiResult<>(list, pagination);

    }

    @GetMapping(path = "disease/{seq}/view")
    @Operation(summary = "질환 상세")
    public ApiResult<AdminDiseaseDetailRsp> getAdminDiseaseDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                  @PathVariable Long seq) {

        if (!diseaseMapper.getAdminHpDiseaseDetail(seq).isPresent()) {
            throw new DiseaseNotFoundException();
        }

        AdminDiseaseRsp rsp = diseaseMapper.getAdminHpDiseaseDetail(seq).get();

        return new ApiResult<>(AdminDiseaseDetailRsp.builder()
                .hospitalSeq(rsp.getHospitalSeq())
                .hospitalName(rsp.getHospitalName())
                .diseaseSeq(rsp.getDiseaseSeq())
                .diseaseName(rsp.getDiseaseName())
                .options(hpDiseaseOptionRepository.findByHpDiseaseSeqAndEnabledOrderBySort(seq, true))
                .treatments(hpDiseaseTreatmentRepository.findByHpDiseaseSeqAndEnabledOrderBySort(seq, true))
                .build());

    }

    @PostMapping(path = "disease")
    @Operation(summary = "질환 등록")
    public ApiResult<Boolean> postAdminDisease(@AuthenticationPrincipal JwtAuthentication authentication,
                                               @RequestBody HpDiseaseRequest dto) {

        if (hpDiseaseRepository.findByHospitalSeqAndDiseaseSeqAndEnabled(dto.getHospitalSeq(), dto.getDiseaseSeq(), true).isPresent()) {
            throw new AlreadyDiseaseDuplicateException();
        }

        HpDisease saveDisease = hpDiseaseRepository.save(HpDisease.builder()
                .hospitalSeq(dto.getHospitalSeq())
                .diseaseSeq(dto.getDiseaseSeq())
                .enabled(true)
                .build());

        Long hpDiseaseSeq = saveDisease.getSeq();

        List<HpDiseaseOption> list = dto.getOptions().stream().map(option -> HpDiseaseOption.builder()
                .hpDiseaseSeq(hpDiseaseSeq)
                .groupName(option.getGroupName())
                .optionName(option.getOptionName())
                .sort(option.getSort())
                .enabled(true)
                .build()).collect(Collectors.toList());

        hpDiseaseOptionRepository.saveAll(list);

        List<HpDiseaseTreatment> collect = dto.getTreatments().stream().map(s -> HpDiseaseTreatment.builder()
                .hpDiseaseSeq(hpDiseaseSeq)
                .name(s.getName())
                .sort(s.getSort())
                .enabled(true)
                .build()).collect(Collectors.toList());

        hpDiseaseTreatmentRepository.saveAll(collect);

        return new ApiResult<>(true);

    }

    @PutMapping(path = "disease/{seq}/view")
    @Operation(summary = "질환 수정")
    public ApiResult<Boolean> putAdminDisease(@AuthenticationPrincipal JwtAuthentication authentication,
                                              @PathVariable Long seq,
                                              @RequestBody HpDiseaseRequest dto) {

        if (!hpDiseaseRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new DiseaseNotFoundException();
        }

        HpDisease hpDisease = hpDiseaseRepository.findBySeqAndEnabled(seq, true).get();

        if (!hpDisease.getHospitalSeq().equals(dto.getHospitalSeq())) {
            hpDisease.setHospitalSeq(dto.getHospitalSeq());
        }

        if (!hpDisease.getDiseaseSeq().equals(dto.getDiseaseSeq())) {
            hpDisease.setDiseaseSeq(dto.getDiseaseSeq());
        }

        hpDiseaseRepository.save(hpDisease);

        for (AdminDiseaseOption option : dto.getOptions()) {

            if (hpDiseaseOptionRepository.findByHpDiseaseSeqAndGroupNameAndOptionNameAndEnabled(seq, option.getGroupName(),
                    option.getOptionName(), true).isPresent()) {

                HpDiseaseOption hpDiseaseOption = hpDiseaseOptionRepository.findByHpDiseaseSeqAndGroupNameAndOptionNameAndEnabled(seq, option.getGroupName(),
                        option.getOptionName(), true).get();

                if (!hpDiseaseOption.getSort().equals(option.getSort())) {
                    hpDiseaseOption.setSort(option.getSort());
                    hpDiseaseOptionRepository.save(hpDiseaseOption);
                }

            } else {
                hpDiseaseOptionRepository.save(HpDiseaseOption.builder()
                        .hpDiseaseSeq(seq)
                        .groupName(option.getGroupName())
                        .optionName(option.getOptionName())
                        .sort(option.getSort())
                        .enabled(true)
                        .build());
            }

        }

        List<HpDiseaseOption> options = hpDiseaseOptionRepository.findByHpDiseaseSeqAndEnabledOrderBySort(seq, true);
        List<HpDiseaseOption> collect = options.stream()
                .filter(_this ->
                        dto.getOptions().stream().noneMatch(target -> _this.getGroupName().equals(target.getGroupName()) &&
                                _this.getOptionName().equals(target.getOptionName())))
                .peek(s -> s.setEnabled(false))
                .collect(Collectors.toList());

        hpDiseaseOptionRepository.saveAll(collect);

        //

        for (AdminDiseaseTreatment treatment : dto.getTreatments()) {

            if (hpDiseaseTreatmentRepository.findByHpDiseaseSeqAndNameAndEnabled(seq, treatment.getName(), true).isPresent()) {

                HpDiseaseTreatment hpDiseaseTreatment = hpDiseaseTreatmentRepository.findByHpDiseaseSeqAndNameAndEnabled(seq, treatment.getName(), true).get();

                if (!hpDiseaseTreatment.getSort().equals(treatment.getSort())) {
                    hpDiseaseTreatment.setSort(treatment.getSort());
                    hpDiseaseTreatmentRepository.save(hpDiseaseTreatment);
                }

            } else {
                hpDiseaseTreatmentRepository.save(HpDiseaseTreatment.builder()
                        .hpDiseaseSeq(seq)
                        .name(treatment.getName())
                        .sort(treatment.getSort())
                        .enabled(true)
                        .build());
            }

        }

        List<HpDiseaseTreatment> treatments = hpDiseaseTreatmentRepository.findByHpDiseaseSeqAndEnabledOrderBySort(seq, true);
        List<HpDiseaseTreatment> collect2 = treatments.stream()
                .filter(_this ->
                        dto.getTreatments().stream().noneMatch(target -> _this.getName().equals(target.getName())))
                .peek(s -> s.setEnabled(false))
                .collect(Collectors.toList());

        hpDiseaseTreatmentRepository.saveAll(collect2);


        return new ApiResult<>(true);

    }


}

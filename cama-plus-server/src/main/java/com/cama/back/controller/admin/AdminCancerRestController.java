package com.cama.back.controller.admin;


import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.disease.CmDisease;
import com.cama.back.dto.hospital.DepartmentRequest;
import com.cama.back.exception.disease.AlreadyDiseaseDuplicateException;
import com.cama.back.exception.disease.DiseaseNotFoundException;
import com.cama.back.repo.disease.CmDiseaseRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin")
@Tag(name = "[Foundation]관리자 질병(암) APIs")
public class AdminCancerRestController {

    private final CmDiseaseRepository cmDiseaseRepository;

    public AdminCancerRestController(CmDiseaseRepository cmDiseaseRepository) {
        this.cmDiseaseRepository = cmDiseaseRepository;
    }

    @GetMapping(path = "cancer/list")
    @Operation(summary = "암 리스트(페이징 없음)")
    public ApiResult<List<CmDisease>> getAdminCancerList(@AuthenticationPrincipal JwtAuthentication authentication) {

        List<CmDisease> list = cmDiseaseRepository.findByEnabledOrderBySeqDesc(true);
        return new ApiResult<>(list);

    }

    @GetMapping(path = "cancer/{seq}/view")
    @Operation(summary = "암 상세")
    public ApiResult<CmDisease> getAdminCancerDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                     @PathVariable Long seq) {

        if (!cmDiseaseRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new AlreadyDiseaseDuplicateException();
        }

        CmDisease cmDisease = cmDiseaseRepository.findBySeqAndEnabled(seq, true).get();
        return new ApiResult<>(cmDisease);

    }

    @PostMapping(path = "cancer")
    @Operation(summary = "암 등록")
    public ApiResult<Boolean> postAdminCancer(@AuthenticationPrincipal JwtAuthentication authentication,
                                              @RequestBody DepartmentRequest dto) {


        if (cmDiseaseRepository.findByNameAndEnabled(dto.getName(), true).isPresent()) {
            throw new AlreadyDiseaseDuplicateException();
        }

        cmDiseaseRepository.save(CmDisease.builder()
                .name(dto.getName())
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PutMapping(path = "cancer/{seq}/view")
    @Operation(summary = "암 수정")
    public ApiResult<Boolean> putAdminCancer(@AuthenticationPrincipal JwtAuthentication authentication,
                                             @PathVariable Long seq,
                                             @RequestBody DepartmentRequest dto) {

        if (!cmDiseaseRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new DiseaseNotFoundException();
        }

        CmDisease cmDisease = cmDiseaseRepository.findBySeqAndEnabled(seq, true).get();

        if (cmDiseaseRepository.findByNameAndEnabled(dto.getName(), true).isPresent()) {
            throw new AlreadyDiseaseDuplicateException();
        }

        cmDisease.setName(dto.getName());
        cmDiseaseRepository.save(cmDisease);

        return new ApiResult<>(true);

    }

    @DeleteMapping(path = "cancer/{seq}/view")
    @Operation(summary = "암 삭제")
    public ApiResult<Boolean> deleteAdminCancer(@AuthenticationPrincipal JwtAuthentication authentication,
                                                @PathVariable Long seq) {

        if (!cmDiseaseRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new DiseaseNotFoundException();
        }

        CmDisease cmDisease = cmDiseaseRepository.findBySeqAndEnabled(seq, true).get();

        cmDisease.setEnabled(false);

        cmDiseaseRepository.save(cmDisease);

        return new ApiResult<>(true);

    }


}

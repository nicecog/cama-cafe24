package com.cama.back.controller.admin;


import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.hospital.CmDepartment;
import com.cama.back.dto.hospital.DepartmentRequest;
import com.cama.back.exception.hospital.AlreadyDepartmentDuplicateException;
import com.cama.back.exception.hospital.DepartmentNotFoundException;
import com.cama.back.repo.hospital.CmDepartmentRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/admin")
@Tag(name = "[Foundation]관리자 전공 APIs")
public class AdminDepartmentRestController {

    private final CmDepartmentRepository cmDepartmentRepository;

    public AdminDepartmentRestController(CmDepartmentRepository cmDepartmentRepository) {
        this.cmDepartmentRepository = cmDepartmentRepository;
    }

    @GetMapping(path = "department/list")
    @Operation(summary = "전공 리스트(페이징 없음)")
    public ApiResult<List<CmDepartment>> getAdminDepartmentList(@AuthenticationPrincipal JwtAuthentication authentication) {

        List<CmDepartment> list = cmDepartmentRepository.findByEnabledOrderBySeqDesc(true);
        return new ApiResult<>(list);

    }

    @GetMapping(path = "department/{seq}/view")
    @Operation(summary = "전공 상세")
    public ApiResult<CmDepartment> getAdminDepartmentDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                            @PathVariable Long seq) {

        if (!cmDepartmentRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new DepartmentNotFoundException();
        }

        CmDepartment cmDepartment = cmDepartmentRepository.findBySeqAndEnabled(seq, true).get();
        return new ApiResult<>(cmDepartment);

    }

    @PostMapping(path = "department")
    @Operation(summary = "전공 등록")
    public ApiResult<Boolean> postAdminDepartment(@AuthenticationPrincipal JwtAuthentication authentication,
                                                  @RequestBody DepartmentRequest dto) {


        if (cmDepartmentRepository.findByNameAndEnabled(dto.getName(), true).isPresent()) {
            throw new AlreadyDepartmentDuplicateException();
        }

        cmDepartmentRepository.save(CmDepartment.builder()
                .name(dto.getName())
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PutMapping(path = "department/{seq}/view")
    @Operation(summary = "전공 수정")
    public ApiResult<Boolean> putAdminDepartment(@AuthenticationPrincipal JwtAuthentication authentication,
                                                 @PathVariable Long seq,
                                                 @RequestBody DepartmentRequest dto) {

        if (!cmDepartmentRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new DepartmentNotFoundException();
        }

        CmDepartment department = cmDepartmentRepository.findBySeqAndEnabled(seq, true).get();

        if (cmDepartmentRepository.findByNameAndEnabled(dto.getName(), true).isPresent()) {
            throw new AlreadyDepartmentDuplicateException();
        }

        department.setName(dto.getName());
        cmDepartmentRepository.save(department);

        return new ApiResult<>(true);

    }

    @DeleteMapping(path = "department/{seq}/view")
    @Operation(summary = "전공 삭제")
    public ApiResult<Boolean> deleteAdminDepartment(@AuthenticationPrincipal JwtAuthentication authentication,
                                                    @PathVariable Long seq) {

        if (!cmDepartmentRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new DepartmentNotFoundException();
        }

        CmDepartment department = cmDepartmentRepository.findBySeqAndEnabled(seq, true).get();

        department.setEnabled(false);

        cmDepartmentRepository.save(department);

        return new ApiResult<>(true);

    }


}

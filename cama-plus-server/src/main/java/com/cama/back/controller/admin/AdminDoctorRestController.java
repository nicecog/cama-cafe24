package com.cama.back.controller.admin;


import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.doctor.CmDoctor;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.doctor.DoctorRequest;
import com.cama.back.dto.doctor.DoctorRsp;
import com.cama.back.dto.hospital.HospitalRsp;
import com.cama.back.exception.doctor.AlreadyDoctorDuplicateException;
import com.cama.back.exception.doctor.DoctorNotFoundException;
import com.cama.back.exception.hospital.HospitalNotFoundException;
import com.cama.back.mapper.DoctorMapper;
import com.cama.back.repo.doctor.CmDoctorRepository;
import com.cama.back.security.JwtAuthentication;
import com.cama.back.util.JhUtil;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@RestController
@RequestMapping("api/admin")
@Tag(name = "[Foundation]관리자 의사 APIs")
public class AdminDoctorRestController {

    private final CmDoctorRepository cmDoctorRepository;
    private final DoctorMapper doctorMapper;
    private final PasswordEncoder passwordEncoder;
    private final JhUtil jhUtil;

    public AdminDoctorRestController(CmDoctorRepository cmDoctorRepository, DoctorMapper doctorMapper,
                                     PasswordEncoder passwordEncoder, JhUtil jhUtil) {
        this.cmDoctorRepository = cmDoctorRepository;
        this.doctorMapper = doctorMapper;
        this.passwordEncoder = passwordEncoder;
        this.jhUtil = jhUtil;
    }

    @GetMapping(path = "doctor/list")
    @Operation(summary = "의사 리스트")
    public ApiResult<List<DoctorRsp>> getAdminDoctorList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                         SearchParam searchParam) {

        int totalCount = doctorMapper.getAdminDoctorListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<DoctorRsp> list = doctorMapper.getAdminDoctorList(searchParam);

        return new ApiResult<>(list, pagination);

    }

    @GetMapping(path = "doctor/{seq}/view")
    @Operation(summary = "의사 상세")
    public ApiResult<DoctorRsp> getAdminDoctorDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                     @PathVariable Long seq) {

        if (!doctorMapper.getDoctorDetail(seq).isPresent()) {
            throw new HospitalNotFoundException();
        }

        DoctorRsp doctorRsp = doctorMapper.getDoctorDetail(seq).get();
        return new ApiResult<>(doctorRsp);

    }

    @PostMapping(path = "doctor")
    @Operation(summary = "의사 등록")
    public ApiResult<Boolean> postAdminDoctor(@AuthenticationPrincipal JwtAuthentication authentication,
                                              @RequestBody DoctorRequest dto) {

        checkArgument(isNotEmpty(dto.getLoginId()), "로그인 아이디 값은 필수 입니다.");
        checkArgument(jhUtil.checkPassword(dto.getPassword()), "비밀번호: 8~12자의 영문 대/소문자, 숫자, 특수문자를 사용해 주세요.");

        if (cmDoctorRepository.findByLoginId(dto.getLoginId()).isPresent()) {
            throw new AlreadyDoctorDuplicateException(dto.getLoginId());
        }

        cmDoctorRepository.save(CmDoctor.builder()
                .loginId(dto.getLoginId())
                .password(passwordEncoder.encode(dto.getPassword()))
                .name(dto.getName())
                .nick(dto.getNick())
                .phone(dto.getPhone())
                .hospitalSeq(dto.getHospitalSeq())
                .departmentSeq(dto.getDepartmentSeq())
                .profileImage(dto.getProfileImage())
                .profileLink(dto.getProfileLink())
                .enabled(true)
                .build());

        return new ApiResult<>(true);

    }

    @PutMapping(path = "doctor/{seq}/view")
    @Operation(summary = "의사 수정")
    public ApiResult<Boolean> putAdminDoctor(@AuthenticationPrincipal JwtAuthentication authentication,
                                             @PathVariable Long seq,
                                             @RequestBody DoctorRequest dto) {

        if (!cmDoctorRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new DoctorNotFoundException();
        }

        CmDoctor doctor = cmDoctorRepository.findBySeqAndEnabled(seq, true).get();

        doctor.setName(dto.getName());
        doctor.setNick(dto.getNick());
        doctor.setPhone(dto.getPhone());
        doctor.setHospitalSeq(dto.getHospitalSeq());
        doctor.setDepartmentSeq(dto.getDepartmentSeq());
        doctor.setProfileImage(dto.getProfileImage());
        doctor.setProfileLink(dto.getProfileLink());

        cmDoctorRepository.save(doctor);

        return new ApiResult<>(true);

    }

    @DeleteMapping(path = "doctor/{seq}/view")
    @Operation(summary = "의사 삭제")
    public ApiResult<Boolean> deleteAdminDoctor(@AuthenticationPrincipal JwtAuthentication authentication,
                                                @PathVariable Long seq) {

        if (!cmDoctorRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new DoctorNotFoundException();
        }

        CmDoctor doctor = cmDoctorRepository.findBySeqAndEnabled(seq, true).get();

        doctor.setEnabled(false);

        cmDoctorRepository.save(doctor);

        return new ApiResult<>(true);

    }


}

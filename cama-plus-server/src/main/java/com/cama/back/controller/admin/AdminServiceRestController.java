package com.cama.back.controller.admin;

import com.cama.back.domain.account.AccountDisease;
import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.disease.CmDisease;
import com.cama.back.domain.disease.CmDiseaseDetail;
import com.cama.back.domain.doctor.CmDoctor;
import com.cama.back.domain.hospital.HospitalService;
import com.cama.back.domain.hospital.ServiceStatus;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.doctor.DiseaseInfo;
import com.cama.back.dto.doctor.ServiceRsp;
import com.cama.back.dto.doctor.ServiceStatusRequest;
import com.cama.back.exception.disease.DiseaseDetailNotFoundException;
import com.cama.back.exception.doctor.DoctorNotFoundException;
import com.cama.back.exception.hospital.HospitalServiceNotFoundException;
import com.cama.back.mapper.DoctorMapper;
import com.cama.back.repo.account.AccountDiseaseRepository;
import com.cama.back.repo.disease.CmDiseaseDetailRepository;
import com.cama.back.repo.disease.CmDiseaseRepository;
import com.cama.back.repo.doctor.CmDoctorRepository;
import com.cama.back.repo.hospital.HospitalServiceRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isNotBlank;

@RestController
@RequestMapping("api/admin")
@Tag(name = "[Foundation]관리자 서비스 APIs")
public class AdminServiceRestController {

    private final DoctorMapper doctorMapper;
    private final CmDoctorRepository cmDoctorRepository;
    private final HospitalServiceRepository hospitalServiceRepository;
    private final AccountDiseaseRepository accountDiseaseRepository;
    private final CmDiseaseRepository cmDiseaseRepository;
    private final CmDiseaseDetailRepository cmDiseaseDetailRepository;

    public AdminServiceRestController(DoctorMapper doctorMapper,
                                      CmDoctorRepository cmDoctorRepository,
                                      HospitalServiceRepository hospitalServiceRepository,
                                      AccountDiseaseRepository accountDiseaseRepository,
                                      CmDiseaseRepository cmDiseaseRepository,
                                      CmDiseaseDetailRepository cmDiseaseDetailRepository) {
        this.doctorMapper = doctorMapper;
        this.cmDoctorRepository = cmDoctorRepository;
        this.hospitalServiceRepository = hospitalServiceRepository;
        this.accountDiseaseRepository = accountDiseaseRepository;
        this.cmDiseaseRepository = cmDiseaseRepository;
        this.cmDiseaseDetailRepository = cmDiseaseDetailRepository;
    }

    @GetMapping(path = "service/list")
    @Operation(summary = "서비스 신청 리스트 (전체 또는 병원별)")
    public ApiResult<List<ServiceRsp>> getAdminServiceList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                           SearchParam searchParam) {

        int totalCount = doctorMapper.getServiceListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        return new ApiResult<>(doctorMapper.getServiceList(searchParam), pagination);
    }

    @GetMapping(path = "service/{seq}/view")
    @Operation(summary = "서비스 신청 상세")
    public ApiResult<ServiceRsp> getAdminServiceDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                     @PathVariable Long seq) {

        return new ApiResult<>(doctorMapper.getServiceDetail(seq, null)
                .orElseThrow(HospitalServiceNotFoundException::new));
    }

    @PutMapping(path = "service/{seq}/view")
    @Operation(summary = "서비스 승인 및 거절")
    @Transactional
    public ApiResult<Boolean> putAdminServiceStatus(@AuthenticationPrincipal JwtAuthentication authentication,
                                                  @PathVariable Long seq,
                                                  @RequestBody ServiceStatusRequest dto) {

        checkArgument(dto.getStatus() != null, "상태 값은 필수 입니다.");

        HospitalService service = hospitalServiceRepository.findById(seq)
                .filter(HospitalService::isEnabled)
                .orElseThrow(HospitalServiceNotFoundException::new);

        if (dto.getStatus() == ServiceStatus.REJECT) {
            service.setEnabled(false);
            hospitalServiceRepository.save(service);
            return new ApiResult<>(true);
        }

        if (dto.getStatus() == ServiceStatus.APPROVE) {
            checkArgument(dto.getDiseaseList() != null && !dto.getDiseaseList().isEmpty(),
                    "승인 시 질병 정보는 필수 입니다.");

            CmDoctor doctor = resolveHospitalDoctor(service.getHospitalSeq());

            for (DiseaseInfo info : dto.getDiseaseList()) {
                CmDisease disease = cmDiseaseRepository.findBySeqAndEnabled(info.getDiseaseSeq(), true)
                        .orElseThrow(DiseaseDetailNotFoundException::new);
                CmDiseaseDetail detail = cmDiseaseDetailRepository.findById(info.getDiseaseDetailSeq())
                        .filter(CmDiseaseDetail::isEnabled)
                        .orElseThrow(DiseaseDetailNotFoundException::new);

                accountDiseaseRepository.save(AccountDisease.builder()
                        .accountSeq(service.getAccountSeq())
                        .serviceSeq(service.getSeq())
                        .diseaseSeq(info.getDiseaseSeq())
                        .diseaseName(disease.getName())
                        .diseaseDetailSeq(info.getDiseaseDetailSeq())
                        .diseaseDetailName(detail.getName())
                        .doctorSeq(doctor.getSeq())
                        .enabled(true)
                        .build());
            }
            return new ApiResult<>(true);
        }

        throw new IllegalArgumentException("지원하지 않는 상태입니다.");
    }

    /** 승인 시 account_disease.doctor_seq — 해당 병원의 활성 의사 중 1명을 사용 */
    private CmDoctor resolveHospitalDoctor(Long hospitalSeq) {
        List<CmDoctor> doctors = cmDoctorRepository.findByHospitalSeqAndEnabled(hospitalSeq, true);
        if (doctors.isEmpty()) {
            throw new DoctorNotFoundException();
        }
        if (doctors.size() == 1) {
            return doctors.get(0);
        }
        return doctors.stream()
                .filter(d -> isNotBlank(d.getLoginId()))
                .findFirst()
                .orElse(doctors.get(0));
    }
}

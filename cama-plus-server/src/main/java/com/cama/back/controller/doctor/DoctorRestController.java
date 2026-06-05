package com.cama.back.controller.doctor;


import com.cama.back.AppContext;
import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.contents.CmContents;
import com.cama.back.domain.wellbeing.CmWellbeingResources;
import com.cama.back.domain.contents.CmContentsVideo;
import com.cama.back.domain.doctor.CmDoctor;
import com.cama.back.domain.account.AccountDisease;
import com.cama.back.domain.disease.CmDisease;
import com.cama.back.domain.disease.CmDiseaseDetail;
import com.cama.back.domain.hospital.HospitalService;
import com.cama.back.domain.hospital.ServiceStatus;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.coaching.UserAnswerInfo;
import com.cama.back.dto.doctor.ContentsRequest;
import com.cama.back.dto.doctor.ContentsRsp;
import com.cama.back.dto.doctor.DiseaseInfo;
import com.cama.back.dto.doctor.DoctorCountRsp;
import com.cama.back.dto.doctor.ServiceRsp;
import com.cama.back.dto.doctor.ServiceStatusRequest;
import com.cama.back.dto.wellbeing.WellbeingResource;
import com.cama.back.exception.account.AccountNotFoundException;
import com.cama.back.exception.contents.ContentsAuthException;
import com.cama.back.exception.contents.ContentsNotFoundException;
import com.cama.back.exception.disease.DiseaseDetailNotFoundException;
import com.cama.back.exception.doctor.DoctorNotFoundException;
import com.cama.back.exception.hospital.HospitalServiceNotFoundException;
import com.cama.back.exception.wellbeing.WellbeingResourceNotFoundException;
import com.cama.back.mapper.ContentsMapper;
import com.cama.back.mapper.DoctorMapper;
import com.cama.back.repo.account.AccountDiseaseRepository;
import com.cama.back.repo.contents.CmContentsRepository;
import com.cama.back.repo.disease.CmDiseaseDetailRepository;
import com.cama.back.repo.disease.CmDiseaseRepository;
import com.cama.back.repo.hospital.HospitalServiceRepository;
import com.cama.back.repo.wellbeing.CmWellbeingResourcesRepository;
import com.cama.back.repo.doctor.CmDoctorRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

import static com.google.common.base.Preconditions.checkArgument;
import static org.apache.commons.lang3.StringUtils.isNotEmpty;

@RestController
@RequestMapping("api")
@Tag(name = "의사 APIs")
public class DoctorRestController {

    private final CmContentsRepository cmContentsRepository;
    private final ContentsMapper contentsMapper;
    private final DoctorMapper doctorMapper;
    private final CmDoctorRepository cmDoctorRepository;
    private final CmWellbeingResourcesRepository cmWellbeingResourcesRepository;
    private final HospitalServiceRepository hospitalServiceRepository;
    private final AccountDiseaseRepository accountDiseaseRepository;
    private final CmDiseaseRepository cmDiseaseRepository;
    private final CmDiseaseDetailRepository cmDiseaseDetailRepository;

    public DoctorRestController(CmContentsRepository cmContentsRepository,
                                ContentsMapper contentsMapper,
                                DoctorMapper doctorMapper,
                                CmDoctorRepository cmDoctorRepository,
                                CmWellbeingResourcesRepository cmWellbeingResourcesRepository,
                                HospitalServiceRepository hospitalServiceRepository,
                                AccountDiseaseRepository accountDiseaseRepository,
                                CmDiseaseRepository cmDiseaseRepository,
                                CmDiseaseDetailRepository cmDiseaseDetailRepository) {
        this.cmContentsRepository = cmContentsRepository;
        this.contentsMapper = contentsMapper;
        this.doctorMapper = doctorMapper;
        this.cmDoctorRepository = cmDoctorRepository;
        this.cmWellbeingResourcesRepository = cmWellbeingResourcesRepository;
        this.hospitalServiceRepository = hospitalServiceRepository;
        this.accountDiseaseRepository = accountDiseaseRepository;
        this.cmDiseaseRepository = cmDiseaseRepository;
        this.cmDiseaseDetailRepository = cmDiseaseDetailRepository;
    }

    @GetMapping(path = "doctor/me")
    @Operation(summary = "의사 정보")
    public ApiResult<CmDoctor> getDoctorMe(@AuthenticationPrincipal JwtAuthentication authentication) {

        String loginId = authentication.loginId;

        if (!cmDoctorRepository.findByLoginIdAndEnabled(loginId, true).isPresent()) {
            throw new DoctorNotFoundException();
        }

        CmDoctor cmDoctor = cmDoctorRepository.findByLoginIdAndEnabled(loginId, true).get();

        cmDoctor.setLastedAt(AppContext.LOCAL_DATE_TIME());
        cmDoctorRepository.save(cmDoctor);

        return new ApiResult<>(cmDoctor);

    }

    @GetMapping(path = "doctor/count/info")
    @Operation(summary = "의사페이지 숫자 정보")
    public ApiResult<DoctorCountRsp> getDoctorCountInfo(@AuthenticationPrincipal JwtAuthentication authentication) {

        Long doctorSeq = authentication.id.value();

        return new ApiResult<>(DoctorCountRsp.builder()
                .doneContents(contentsMapper.getDoneContentsCount())
                .ingContents(contentsMapper.getIngContentsCount())
                .patientContents(contentsMapper.getPatientContentsCount(doctorSeq))
                .build());

    }

    @PostMapping(path = "doctor/contents")
    @Operation(summary = "치료정보 등록")
    public ApiResult<Boolean> postDoctorContents(@AuthenticationPrincipal JwtAuthentication authentication,
                                                 @RequestBody ContentsRequest dto) {

        checkArgument(isNotEmpty(dto.getTitle()), "질문 값은 필수 입니다.");
        if (dto.isViewed()) {
            checkArgument(isNotEmpty(dto.getContents()), "치료정보 값은 필수 입니다.");
        }

        Long doctorSeq = authentication.id.value();
        
        String lang = "KO";
        
        if (dto.getLang() != null) lang = dto.getLang();

        cmContentsRepository.save(CmContents.builder()
                .doctorSeq(doctorSeq)
                .diseaseSeq(dto.getDiseaseSeq())
                .title(dto.getTitle())
                .contents(dto.getContents())
                //.careTimeType(dto.getCareTimeType())
                .disease(dto.getDisease())
                .interest(dto.getInterest())
                .image(dto.getImage())
                .enabled(true)
                .viewed(dto.isViewed())
                .priority(dto.getPriority())
                .viewCount(0L)
                .contentsUpdatedAt(AppContext.LOCAL_DATE_TIME())
                .lang(lang)
                .build());

        return new ApiResult<>(true);

    }

    @GetMapping(path = "doctor/contents")
    @Operation(summary = "치료정보 리스트")
    public ApiResult<List<ContentsRsp>> getDoctorContentsList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                              SearchParam searchParam) {

        String lang = "KO";
        
        if (searchParam.getLang() == null) searchParam.setLang(lang);
        
        int totalCount = contentsMapper.getDoctorContentsListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<ContentsRsp> list = contentsMapper.getDoctorContentsList(searchParam);

        List<ContentsRsp> collect = list.stream().peek(s -> {
//            List<Long> box = Arrays.stream(s.getCareTimeType().split(",")).map(Long::parseLong).collect(Collectors.toList());
//            s.setCareTimeList(careTimeTypeRepository.findBySeqInAndEnabledOrderBySeqDesc(box, true));
        }).collect(Collectors.toList());

        return new ApiResult<>(collect, pagination);

    }

    @GetMapping(path = "doctor/disable/contents")
    @Operation(summary = "치료정보 비활성 리스트")
    public ApiResult<List<ContentsRsp>> getDoctorDisableContentsList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                     SearchParam searchParam) {

        String lang = "KO";
        
        if (searchParam.getLang() == null) searchParam.setLang(lang);
        
        int totalCount = contentsMapper.getContentDisablesListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<ContentsRsp> list = contentsMapper.getContentDisablesList(searchParam);

        List<ContentsRsp> collect = list.stream().peek(s -> {
//            List<Long> box = Arrays.stream(s.getCareTimeType().split(",")).map(Long::parseLong).collect(Collectors.toList());
//            s.setCareTimeList(careTimeTypeRepository.findBySeqInAndEnabledOrderBySeqDesc(box, true));
        }).collect(Collectors.toList());

        return new ApiResult<>(collect, pagination);

    }

    @PutMapping(path = "doctor/contents/{seq}/view")
    @Operation(summary = "치료정보 수정")
    public ApiResult<Boolean> putDoctorContents(@AuthenticationPrincipal JwtAuthentication authentication,
                                                @PathVariable Long seq, @RequestBody ContentsRequest dto) {

        checkArgument(isNotEmpty(dto.getTitle()), "질문 값은 필수 입니다.");
        if (dto.isViewed()) {
            checkArgument(isNotEmpty(dto.getContents()), "치료정보 값은 필수 입니다.");
        }

        Long doctorSeq = authentication.id.value();

        if (!cmContentsRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new ContentsNotFoundException();
        }

        CmContents rsp = cmContentsRepository.findBySeqAndEnabled(seq, true).get();

        if (!rsp.getDoctorSeq().equals(doctorSeq)) {
            throw new ContentsAuthException();
        }

        rsp.setDiseaseSeq(dto.getDiseaseSeq());
        rsp.setTitle(dto.getTitle());
        rsp.setContents(dto.getContents());
        rsp.setInterest(dto.getInterest());
        rsp.setImage(dto.getImage());
        rsp.setDisease(dto.getDisease());
        rsp.setViewed(dto.isViewed());
        rsp.setPriority(dto.getPriority());

        rsp.setContentsUpdatedAt(AppContext.LOCAL_DATE_TIME());

        cmContentsRepository.save(rsp);

        return new ApiResult<>(true);

    }

    @DeleteMapping(path = "doctor/contents/{seq}/view")
    @Operation(summary = "치료정보 삭제")
    public ApiResult<Boolean> deleteDoctorContents(@AuthenticationPrincipal JwtAuthentication authentication,
                                                   @PathVariable Long seq) {

        Long doctorSeq = authentication.id.value();

        if (!cmContentsRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new ContentsNotFoundException();
        }

        CmContents rsp = cmContentsRepository.findBySeqAndEnabled(seq, true).get();
        rsp.setEnabled(false);

        cmContentsRepository.save(rsp);

        return new ApiResult<>(true);

    }

    @GetMapping(path = "doctor/service")
    @Operation(summary = "서비스 신청 리스트")
    public ApiResult<List<ServiceRsp>> getDoctorServiceList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                            SearchParam searchParam) {

        CmDoctor doctor = cmDoctorRepository.findByLoginIdAndEnabled(authentication.loginId, true)
                .orElseThrow(DoctorNotFoundException::new);
        searchParam.setHospitalSeq(doctor.getHospitalSeq());

        int totalCount = doctorMapper.getServiceListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        return new ApiResult<>(doctorMapper.getServiceList(searchParam), pagination);
    }

    @GetMapping(path = "doctor/service/{seq}/view")
    @Operation(summary = "서비스 신청 상세")
    public ApiResult<ServiceRsp> getDoctorServiceDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                        @PathVariable Long seq) {

        CmDoctor doctor = cmDoctorRepository.findByLoginIdAndEnabled(authentication.loginId, true)
                .orElseThrow(DoctorNotFoundException::new);

        return new ApiResult<>(doctorMapper.getServiceDetail(seq, doctor.getHospitalSeq())
                .orElseThrow(HospitalServiceNotFoundException::new));
    }

    @PutMapping(path = "doctor/service/{seq}/view")
    @Operation(summary = "서비스 승인 및 거절")
    @Transactional
    public ApiResult<Boolean> putDoctorServiceStatus(@AuthenticationPrincipal JwtAuthentication authentication,
                                                     @PathVariable Long seq,
                                                     @RequestBody ServiceStatusRequest dto) {

        checkArgument(dto.getStatus() != null, "상태 값은 필수 입니다.");

        CmDoctor doctor = cmDoctorRepository.findByLoginIdAndEnabled(authentication.loginId, true)
                .orElseThrow(DoctorNotFoundException::new);

        HospitalService service = hospitalServiceRepository.findById(seq)
                .filter(HospitalService::isEnabled)
                .orElseThrow(HospitalServiceNotFoundException::new);

        if (!service.getHospitalSeq().equals(doctor.getHospitalSeq())) {
            throw new HospitalServiceNotFoundException();
        }

        if (dto.getStatus() == ServiceStatus.REJECT) {
            service.setEnabled(false);
            hospitalServiceRepository.save(service);
            return new ApiResult<>(true);
        }

        if (dto.getStatus() == ServiceStatus.APPROVE) {
            checkArgument(dto.getDiseaseList() != null && !dto.getDiseaseList().isEmpty(),
                    "승인 시 질병 정보는 필수 입니다.");

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

    @GetMapping(path = "doctor/contents/{seq}/view")
    @Operation(summary = "치료정보 상세")
    public ApiResult<ContentsRsp> getDoctorContentsDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                          @PathVariable Long seq) {

        if (!contentsMapper.getDoctorContentsDetail(seq).isPresent()) {
            throw new ContentsNotFoundException();
        }

        ContentsRsp rsp = contentsMapper.getDoctorContentsDetail(seq).get();
//        List<Long> box = Arrays.stream(rsp.getCareTimeType().split(",")).map(Long::parseLong).collect(Collectors.toList());
//        rsp.setCareTimeList(careTimeTypeRepository.findBySeqInAndEnabledOrderBySeqDesc(box, true));

        return new ApiResult<>(rsp);

    }
    
    
    @PostMapping(path = "doctor/contents/getCmVideoInfoList")
    @Operation(summary = "건강코칭 유튜브 정보 리스트")
    public ApiResult<List<CmContentsVideo>> getCmVideoInfoList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody CmContentsVideo dto) {
    	
    	String lang = "KO";
    	
    	if (dto.getLang() == null) dto.setLang(lang);
	
    	List<CmContentsVideo> list = contentsMapper.getCmVideoInfoList(dto);

        return new ApiResult<>(list);

    }

    @PutMapping(path = "doctor/contents/putCmVideoInfo")
    @Operation(summary = "건강코칭 유튜브 정보 저장")
    public ApiResult<Boolean> putCmVideoInfo(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody CmContentsVideo dto) {
        int existCnt = 0;
        int processCnt = 0;
        Boolean chk = true;
        
        String lang = "KO";
                
        if (dto.getLang() == null) dto.setLang(lang);
              		
        existCnt = contentsMapper.getCmVideoCnt(dto);
        
        if ( existCnt > 0) {
        	processCnt = contentsMapper.updateCmVideo(dto);
        } else {
        	processCnt = contentsMapper.insertCmVideo(dto);
        }
        
        if (processCnt > 0 ) chk = true;
        else chk = false;
        
        return new ApiResult<>(chk);

    }

    @PostMapping(path = "doctor/wellbeing/resources/insertWellbeingResources")
    @Operation(summary = "웰빙자원 등록")
    public ApiResult<Boolean> insertWellbeingResources(@AuthenticationPrincipal JwtAuthentication authentication,
                                                 @RequestBody WellbeingResource dto) {
    	String lang = "KO";

        checkArgument(isNotEmpty(dto.getWellbeingCategoryCd()), "웰빙자원 카테고리 값은 필수 입니다.");
 
        //if (!dto.getLang().isBlank()) lang = dto.getLang();
        if (dto.getLang() != null) lang = dto.getLang();
        
    	cmWellbeingResourcesRepository.save(CmWellbeingResources.builder()
                .wellbeingCategoryCd(dto.getWellbeingCategoryCd())
                .companyName(dto.getCompanyName())
                .companyDescription(dto.getCompanyDescription())
                .title(dto.getTitle())
                .contents(dto.getContents())
                .thumbnail(dto.getThumbnail())
                .address(dto.getAddress())
                .phoneNumber(dto.getPhoneNumber())
                .homepage(dto.getHomepage())
                .sns(dto.getSns())
                .enabled(true)
                .priority(dto.getPriority())
                .lang(lang)
                .build());

        return new ApiResult<>(true);

    }

    @PutMapping(path = "doctor/wellbeing/resources/{seq}/view/updateWellbeingResources")
    @Operation(summary = "웰빙자원 수정")
    public ApiResult<Boolean> updateWellbeingResources(@AuthenticationPrincipal JwtAuthentication authentication,
                                                @PathVariable Long seq, @RequestBody WellbeingResource dto) {

    	checkArgument(isNotEmpty(dto.getWellbeingCategoryCd()), "웰빙자원 카테고리 값은 필수 입니다.");

        if (!cmWellbeingResourcesRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new WellbeingResourceNotFoundException();
        }

        CmWellbeingResources rsp = cmWellbeingResourcesRepository.findBySeqAndEnabled(seq, true).get();

        rsp.setWellbeingCategoryCd(dto.getWellbeingCategoryCd());
        rsp.setCompanyName(dto.getCompanyName());
        rsp.setCompanyDescription(dto.getCompanyDescription());
        rsp.setTitle(dto.getTitle());
        rsp.setContents(dto.getContents());
        rsp.setThumbnail(dto.getThumbnail());
        rsp.setAddress(dto.getAddress());
        rsp.setPhoneNumber(dto.getPhoneNumber());
        rsp.setHomepage(dto.getHomepage());
        rsp.setSns(dto.getSns());
        //rsp.setEnabled(dto.isEnabled());
        rsp.setPriority(dto.getPriority());

        cmWellbeingResourcesRepository.save(rsp);

        return new ApiResult<>(true);

    }

    @DeleteMapping(path = "doctor/wellbeing/resources/{seq}/view/deleteWellbeingResources")
    @Operation(summary = "웰빙자원 삭제")
    public ApiResult<Boolean> deleteWellbeingResources(@AuthenticationPrincipal JwtAuthentication authentication,
                                                   @PathVariable Long seq) {

        if (!cmWellbeingResourcesRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new WellbeingResourceNotFoundException();
        }
        
    	CmWellbeingResources rsp = cmWellbeingResourcesRepository.findBySeqAndEnabled(seq, true).get();
        rsp.setEnabled(false);

        cmWellbeingResourcesRepository.save(rsp);

        return new ApiResult<>(true);

    }
    
    @PostMapping(path = "doctor/wellbeing/resources/getWellbeingResourceList")
    @Operation(summary = "웰빙자원 리스트")
    public ApiResult<List<WellbeingResource>> getWellbeingResourceList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody    SearchParam searchParam) {
    	
    	String lang = "KO";
    	
    	if (searchParam.getLang() == null) searchParam.setLang(lang);

        int totalCount = contentsMapper.getWellbeingResourceListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<WellbeingResource> list = contentsMapper.getWellbeingResourceList(searchParam);

        List<WellbeingResource> collect = list.stream().peek(s -> {
//            List<Long> box = Arrays.stream(s.getCareTimeType().split(",")).map(Long::parseLong).collect(Collectors.toList());
//            s.setCareTimeList(careTimeTypeRepository.findBySeqInAndEnabledOrderBySeqDesc(box, true));
        }).collect(Collectors.toList());

        return new ApiResult<>(collect, pagination);

    }
    
    @PostMapping(path = "doctor/wellbeing/{seq}/view/getWellbeingResourceDetail")
    @Operation(summary = "웰빙자원 상세")
    public ApiResult<WellbeingResource> getWellbeingResourceDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                          @PathVariable Long seq) {

        if (!contentsMapper.getWellbeingResourceDetail(seq).isPresent()) {
            throw new WellbeingResourceNotFoundException();
        }

        WellbeingResource rsp = contentsMapper.getWellbeingResourceDetail(seq).get();
//        List<Long> box = Arrays.stream(rsp.getCareTimeType().split(",")).map(Long::parseLong).collect(Collectors.toList());
//        rsp.setCareTimeList(careTimeTypeRepository.findBySeqInAndEnabledOrderBySeqDesc(box, true));

        return new ApiResult<>(rsp);

    }
}

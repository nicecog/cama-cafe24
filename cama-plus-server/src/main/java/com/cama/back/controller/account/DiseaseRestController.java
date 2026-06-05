package com.cama.back.controller.account;


import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.disease.CmDiseaseDetail;
import com.cama.back.domain.track.TrackService;
import com.cama.back.domain.track.TrackStatus;
import com.cama.back.dto.disease.DiseaseAllNameRsp;
import com.cama.back.dto.disease.DiseaseNameRsp;
import com.cama.back.mapper.AccountMapper;
import com.cama.back.mapper.CareTrackMapper;
import com.cama.back.repo.disease.CmDiseaseDetailRepository;
import com.cama.back.repo.track.TrackServiceRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api")
@Tag(name = "유저 질병 APIs")
public class DiseaseRestController {

    private final AccountMapper accountMapper;
    private final TrackServiceRepository trackServiceRepository;
    private final CareTrackMapper careTrackMapper;
    private final CmDiseaseDetailRepository cmDiseaseDetailRepository;

    public DiseaseRestController(AccountMapper accountMapper, TrackServiceRepository trackServiceRepository, CareTrackMapper careTrackMapper, CmDiseaseDetailRepository cmDiseaseDetailRepository) {
        this.accountMapper = accountMapper;
        this.trackServiceRepository = trackServiceRepository;
        this.careTrackMapper = careTrackMapper;
        this.cmDiseaseDetailRepository = cmDiseaseDetailRepository;
    }

    @GetMapping(path = "account/disease")
    @Operation(summary = "질병 리스트")
    public ApiResult<List<DiseaseNameRsp>> getAccountDiseaseList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                 @RequestParam Long hSeq) {

        Long acSeq = authentication.id.value();
        List<DiseaseNameRsp> list = accountMapper.getDiseaseNameList(acSeq, hSeq);

        List<DiseaseNameRsp> collect = list.stream().peek(s -> {

            if (!trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, hSeq, TrackStatus.ACTIVE, true).isPresent()) {
                s.setTrackSeq(0L);
                s.setDays(0L);
                s.setTrackCreatedAt(null);
                s.setProgress(0L);
            } else {
                TrackService ts = trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, hSeq, TrackStatus.ACTIVE, true).get();
                s.setTrackSeq(ts.getSeq());
                s.setDays(ts.getDays());
                s.setTrackCreatedAt(ts.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));

                int trackSize = careTrackMapper.getCareTrackSize(acSeq, ts.getSeq());
                int doneCount = careTrackMapper.getCareTrackDoneCount(acSeq, ts.getSeq());
                s.setProgress(((long) doneCount * 100 / trackSize));
            }

            Long diseaseSeq = s.getDiseaseSeq();

            List<CmDiseaseDetail> details = cmDiseaseDetailRepository.findByDiseaseSeqAndHospitalSeqAndEnabled(diseaseSeq, hSeq, true);
            s.setDiseaseDetails(details);

        }).collect(Collectors.toList());

        return new ApiResult<>(collect);

    }

    @GetMapping(path = "account/disease/all")
    @Operation(summary = "질병 리스트 all")
    public ApiResult<List<DiseaseAllNameRsp>> getAccountDiseaseAllList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                       @RequestParam Long hSeq) {

        Long acSeq = authentication.id.value();
        List<DiseaseAllNameRsp> list = accountMapper.getDiseaseNameAllList(acSeq, hSeq);

        List<DiseaseAllNameRsp> collect = list.stream().peek(s -> {

            if (!trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, hSeq, TrackStatus.ACTIVE, true).isPresent()) {
                s.setTrackSeq(0L);
                s.setDays(0L);
                s.setTrackCreatedAt(null);
                s.setProgress(0L);
            } else {
                TrackService ts = trackServiceRepository.findByAccountSeqAndHospitalSeqAndStatusAndEnabled(acSeq, hSeq, TrackStatus.ACTIVE, true).get();
                s.setTrackSeq(ts.getSeq());
                s.setDays(ts.getDays());
                s.setTrackCreatedAt(ts.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));

                int trackSize = careTrackMapper.getCareTrackSize(acSeq, ts.getSeq());
                int doneCount = careTrackMapper.getCareTrackDoneCount(acSeq, ts.getSeq());
                s.setProgress(((long) doneCount * 100 / trackSize));

            }

            Long diseaseSeq = s.getDiseaseSeq();

            List<CmDiseaseDetail> details = cmDiseaseDetailRepository.findByDiseaseSeqAndHospitalSeqAndEnabled(diseaseSeq, hSeq, true);
            s.setDiseaseDetails(details);

        }).collect(Collectors.toList());

        return new ApiResult<>(collect);

    }

}

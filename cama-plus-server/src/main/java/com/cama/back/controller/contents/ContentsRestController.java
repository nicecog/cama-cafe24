package com.cama.back.controller.contents;


import com.cama.back.controller.track.TrackRestController;
import com.cama.back.domain.api.ApiResult;
import com.cama.back.domain.contents.CmContents;
import com.cama.back.domain.contents.CmContentsVideo;
import com.cama.back.dto.Pagination;
import com.cama.back.dto.SearchParam;
import com.cama.back.dto.doctor.ContentsRsp;
import com.cama.back.dto.doctor.ContentsWebViewRsp;
import com.cama.back.dto.wellbeing.WellbeingResource;
import com.cama.back.dto.doctor.ContentsFavorite;
import com.cama.back.exception.contents.ContentsNotFoundException;
import com.cama.back.exception.wellbeing.WellbeingResourceNotFoundException;
import com.cama.back.mapper.ContentsMapper;
import com.cama.back.mapper.AccountMapper;
import com.cama.back.repo.contents.CmContentsLogRepository;
import com.cama.back.repo.contents.CmContentsRepository;
import com.cama.back.security.JwtAuthentication;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.Operation;
import lombok.extern.slf4j.Slf4j;

import org.apache.commons.lang3.StringUtils;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("api")
@Tag(name = "치료정보 APIs")
public class ContentsRestController {

    private final CmContentsRepository cmContentsRepository;
    private final ContentsMapper contentsMapper;
    private final AccountMapper  accountMapper;

    public ContentsRestController(CmContentsRepository cmContentsRepository, ContentsMapper contentsMapper, AccountMapper accountMapper) {
        this.cmContentsRepository = cmContentsRepository;
        this.contentsMapper = contentsMapper;
        this.accountMapper = accountMapper;
    }

    @GetMapping(path = "contents/list")
    @Operation(summary = "치료정보 리스트")
    public ApiResult<List<ContentsRsp>> getContentsList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                        SearchParam searchParam) {
    	Long acSeq = 0L;
        int procCnt = 0;
        
        String lang = "KO";
        if (searchParam.getLang() == null) searchParam.setLang(lang);
    	
    	//System.out.println("authentication.id.value() => " + authentication.id.value());
    	try {
    	    acSeq = authentication.id.value() == null ? 0L: authentication.id.value();
    	} catch (NullPointerException ne ) {
    		acSeq = 0L;
    	}
    	
    	searchParam.setAcSeq(acSeq);

        int totalCount = contentsMapper.getContentsListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<ContentsRsp> list = contentsMapper.getContentsList(searchParam);
        
        //사용자별 검색 이력 생성  
        procCnt = accountMapper.insertAccountSearchHst(searchParam);

        return new ApiResult<>(list, pagination);

    }

    @PostMapping(path = "webview/contents/list")
    @Operation(summary = "치료정보 리스트")
    public ApiResult<List<ContentsRsp>> getWebviewContentsList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody SearchParam searchParam) {
    	Long acSeq = 0L;
        int procCnt = 0;
        
        String lang = "KO";
        if (searchParam.getLang() == null) searchParam.setLang(lang);
    	
    	//System.out.println("getAcSeq.value() => " + searchParam.getAcSeq());
    	//System.out.println("getSearchText.value() => " + searchParam.getSearchText());
    	//System.out.println("getDiseaseSeqvalue() => " + searchParam.getDiseaseSeq());
    	try {
    	    acSeq = searchParam.getAcSeq() == null ? 0L: searchParam.getAcSeq();
    	} catch (NullPointerException ne ) {
    		acSeq = 0L;
    	}
    	
    	searchParam.setAcSeq(acSeq);
    	searchParam.setPaging(false);

        int totalCount = contentsMapper.getContentsListCount(searchParam);
        Pagination pagination = new Pagination(searchParam.getPage(), totalCount);
        searchParam.setPagination(pagination);

        List<ContentsRsp> list = contentsMapper.getContentsList(searchParam);
        
        //사용자별 검색 이력 생성  
        procCnt = accountMapper.insertAccountSearchHst(searchParam);

        return new ApiResult<>(list, pagination);

    }

    @GetMapping(path = "contents/{seq}/view")
    @Operation(summary = "치료정보 상세")
    public ApiResult<ContentsRsp> getContentsDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                    @PathVariable Long seq) {

        if (!contentsMapper.getContentsDetail(seq).isPresent()) {
            throw new ContentsNotFoundException();
        }

        if (!cmContentsRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new ContentsNotFoundException();
        }

        ContentsRsp rsp = contentsMapper.getContentsDetail(seq).get();
//        List<Long> box = Arrays.stream(rsp.getCareTimeType().split(",")).map(Long::parseLong).collect(Collectors.toList());
//        rsp.setCareTimeList(careTimeTypeRepository.findBySeqInAndEnabledOrderBySeqDesc(box, true));

        CmContents cmContents = cmContentsRepository.findBySeqAndEnabled(seq, true).get();
        cmContents.setViewCount(cmContents.getViewCount() + 1);
        cmContentsRepository.save(cmContents);

        return new ApiResult<>(rsp);

    }

    @GetMapping(path = "webview/contents/{seq}/view")
    @Operation(summary = "치료정보 상세")
    public ApiResult<ContentsRsp> getWebviewContentsDetail(@AuthenticationPrincipal JwtAuthentication authentication,
                                                    @PathVariable Long seq) {

        if (!contentsMapper.getContentsDetail(seq).isPresent()) {
            throw new ContentsNotFoundException();
        }

        if (!cmContentsRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new ContentsNotFoundException();
        }

        ContentsRsp rsp = contentsMapper.getContentsDetail(seq).get();
//        List<Long> box = Arrays.stream(rsp.getCareTimeType().split(",")).map(Long::parseLong).collect(Collectors.toList());
//        rsp.setCareTimeList(careTimeTypeRepository.findBySeqInAndEnabledOrderBySeqDesc(box, true));

        CmContents cmContents = cmContentsRepository.findBySeqAndEnabled(seq, true).get();
        cmContents.setViewCount(cmContents.getViewCount() + 1);
        cmContentsRepository.save(cmContents);

        return new ApiResult<>(rsp);

    }

    @GetMapping(path = "contents/{seq}/webview")
    @Operation(summary = "치료정보 내용 웹뷰용")
    public ApiResult<ContentsWebViewRsp> getContentsDetailWebView(@AuthenticationPrincipal JwtAuthentication authentication,
                                                                  @PathVariable Long seq) {
        //log.info("seq =>" + seq);
        if (!contentsMapper.getContentsDetail(seq).isPresent()) {
            throw new ContentsNotFoundException();
        }

        if (!cmContentsRepository.findBySeqAndEnabled(seq, true).isPresent()) {
            throw new ContentsNotFoundException();
        }

        ContentsRsp rsp = contentsMapper.getContentsDetail(seq).get();
//        List<Long> box = Arrays.stream(rsp.getCareTimeType().split(",")).map(Long::parseLong).collect(Collectors.toList());
        //log.info("seq2 =>" + seq);
        CmContents cmContents = cmContentsRepository.findBySeqAndEnabled(seq, true).get();
        //log.info("cmContents.getSeq =>" + cmContents.getSeq());
        //log.info("cmContents.getViewCount() =>" + cmContents.getViewCount());
        cmContents.setViewCount(cmContents.getViewCount() + 1);
        cmContentsRepository.save(cmContents);

        return new ApiResult<>(ContentsWebViewRsp.builder()
                .contents(rsp.getContents())
                .interest(rsp.getInterest())
                .disease(rsp.getDisease())
                .title(rsp.getTitle())
                .doctorName(rsp.getDoctorName())
                .departmentName(rsp.getDepartmentName())
                .createdAt(rsp.getCreatedAt())
                //.careTimeList(careTimeTypeRepository.findBySeqInAndEnabledOrderBySeqDesc(box, true))
                .build());

    }
    
    @GetMapping(path = "contents/favoriteList")
    @Operation(summary = "나의 즐겨찾기 contents 정보 리스트")
    public ApiResult<List<ContentsRsp>> getFavoriteList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                        SearchParam searchParam) {
    	Long acSeq = authentication.id.value();
    	searchParam.setAcSeq(acSeq);

        List<ContentsRsp> list = contentsMapper.getFavoriteList(searchParam);

        return new ApiResult<>(list);

    }
    
    @GetMapping(path = "webview/contents/favoriteList")
    @Operation(summary = "나의 즐겨찾기 contents 정보 리스트")
    public ApiResult<List<ContentsRsp>> getWebviewFavoriteList(@AuthenticationPrincipal JwtAuthentication authentication,
                                                        SearchParam searchParam) {
    	//Long acSeq = authentication.id.value();
    	//searchParam.setAcSeq(acSeq);

        List<ContentsRsp> list = contentsMapper.getFavoriteList(searchParam);

        return new ApiResult<>(list);

    }
    
    @PutMapping(path = "contents/favoriteSave")
    @Operation(summary = "즐겨찾기 정보 저장")
    public ApiResult<Boolean> putFavoriteSave(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody ContentsFavorite dto) {
        int processCnt = 0;
        Boolean chk = true;
        
        Long acSeq = authentication.id.value();
        dto.setAccountSeq(acSeq);
        
        //처리유형(C:추가 ,D:삭제)
        if ("C".equals(dto.getType())) {
        	processCnt = contentsMapper.insertFavorite(dto);
        } else if ("D".equals(dto.getType())) {
        	processCnt = contentsMapper.updateFavorite(dto);
        }
        		
        if (processCnt > 0 ) chk = true;
        else chk = false;
        
        return new ApiResult<>(chk);

    }
    
    @PutMapping(path = "webview/contents/favoriteSave")
    @Operation(summary = "즐겨찾기 정보 저장")
    public ApiResult<Boolean> putWebviewFavoriteSave(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody ContentsFavorite dto) {
        int processCnt = 0;
        Boolean chk = true;
        
        //Long acSeq = authentication.id.value();
        //dto.setAccountSeq(acSeq);
        
        //처리유형(C:추가 ,D:삭제)
        if ("C".equals(dto.getType())) {
        	processCnt = contentsMapper.insertFavorite(dto);
        } else if ("D".equals(dto.getType())) {
        	processCnt = contentsMapper.updateFavorite(dto);
        }
        		
        if (processCnt > 0 ) chk = true;
        else chk = false;
        
        return new ApiResult<>(chk);

    }
   
    
    @PostMapping(path = "contents/wellbeing/resources/getWellbeingResourceList")
    @Operation(summary = "웰빙자원 리스트")
    public ApiResult<List<WellbeingResource>> getWellbeingResourceList(@AuthenticationPrincipal JwtAuthentication authentication,
    		@RequestBody SearchParam searchParam) {
    	
    	String lang = "KO";
    	
        //log.info("searchParam.getSearchType() => " + searchParam.getSearchType());
        //log.info("searchParam.getSearchText() => " + searchParam.getSearchText());
        
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
    
    @PostMapping(path = "contents/wellbeing/{seq}/view/getWellbeingResourceDetail")
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

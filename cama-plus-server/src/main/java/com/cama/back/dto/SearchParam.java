package com.cama.back.dto;

import lombok.*;

@Getter
@Setter
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SearchParam {

    private int page = 1;
    private String searchType;
    private String searchText;
    private String startDate;
    private String endDate;
    private Pagination pagination;
    private String wellbeingCategoryCd;

    private Long diseaseSeq;

    private Long acSeq;
    private Long dSeq;
    private Long hospitalSeq;

    private boolean paging = true;
    
    private String lang;

}

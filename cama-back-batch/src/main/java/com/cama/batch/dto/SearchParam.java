package com.cama.batch.dto;

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

    private Long diseaseSeq;

    private Long acSeq;
    private Long dSeq;

    private boolean paging = true;

}

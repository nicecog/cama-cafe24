package com.cama.batch.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Pagination {

    //paging
    private int startNum;
    private int endNum;
    private int totalCount;
    private int currentPage;
    private int totalPage;

    //pagination
    private int displayPage = 5;
    private int displayRow = 10;
    private int beginPage;
    private int endPage;
    private int prevPage;
    private int nextPage;

    public Pagination(int currentPage, int totalCount) {
        this.currentPage = currentPage;
        this.totalCount = totalCount;
        this.startNum = (currentPage - 1) * displayRow;
        this.endNum = displayRow;
        this.totalPage = (int) Math.ceil(totalCount / (double) displayRow);
        this.endPage = ((int) Math.ceil(currentPage / (double) displayPage)) * displayPage;
        this.beginPage = endPage - (displayPage - 1);
        if (beginPage < 0) this.beginPage = 1;
        if (endPage > totalPage) this.endPage = totalPage;
        this.prevPage = beginPage <= 1 ? beginPage : beginPage - 5;
        this.nextPage = endPage + 1 < totalPage ? endPage + 1 : totalPage;
    }

}

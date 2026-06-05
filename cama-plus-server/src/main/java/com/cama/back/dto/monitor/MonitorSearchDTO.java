package com.cama.back.dto.monitor;

import com.cama.back.domain.account.Gender;
import com.cama.back.dto.Pagination;

import lombok.*;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonitorSearchDTO {
	
    private String yyyymm;               //검색월 
 	
    private Long acSeq;                  //사용자seq

    private String searchDt;             //검색일

    private String name;                 //사용자명 
    
    private String cancerType;           //암코드 
    
    private String cancerTypeNm;         //암
    
    private String searchText;           //검색어 
    
    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

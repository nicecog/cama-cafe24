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
public class MonitorAcctStatDTO {
	
    private String frYearMonth;          //검색 From월 
    private String toYearMonth;          //검색 To월 
    private String userTypeCd;           //사용자유형
 	
    private String yearMonth;            //년월 

    private String churnRate;            //이탈율 
    
    private String dau;                  //Dau 
    
    private String mau;                  //Mau
    
    private String ancrageRate;          //고착도 
    
    private String value1;               
    private String value2;          
    private String value3;          
    private String value4;          
    
    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

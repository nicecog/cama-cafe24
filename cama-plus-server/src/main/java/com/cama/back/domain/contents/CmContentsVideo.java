package com.cama.back.domain.contents;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder 
public class CmContentsVideo {
	
	private String loginId;       //사용자LoginId

	private int seq;              //Seq

	private int priority;         //우선순위

	private String videoTypeCd;   //영상유형코드
	
	private String url;           //Url
	
    private String useYn;         //사용여부

	private String detailDesc;    //상세설명    
	
	private String createdAt;    //생성일시 
	
	private String updatedAt;    //변경일시 
	
    private String lang; //언어 
	
	@Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

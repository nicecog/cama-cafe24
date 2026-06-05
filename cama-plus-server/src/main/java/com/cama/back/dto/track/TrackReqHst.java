package com.cama.back.dto.track;

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
public class TrackReqHst {
	
	private Long accountSeq;           //사용자seq 

	private Long seq;                  //진행Seq
	
	private String createdAt;          //생성일시
	
	private double progress;           //진도율
	
	private String diseaseName;        //질환 

	private String diseaseTreatment;   //치료시기

	private String diseaseType;        //암종류

	private String diseaseOption;      //고려사항

	private String days;               //진행일자 

	private String interest;           //관심영역

	private String status;             //상태
	
	private String cancelAt;           //종료일시 


    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

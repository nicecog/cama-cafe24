package com.cama.back.dto.coaching;


import lombok.*;

import java.util.List;

import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;




@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseSurveyResult {
	
	private Long seq;                //Seq
	
    private Long accountSeq;         //사용자Seq
    
	private String loginId;          //사용자LoginId
    
    private String accountName;      //사용자명 
    
    private String createdAt;        //생성일시
        
    private String cancerTypeCd;     //암유형코드
    
    private String cancerTypeNm;     //암유형

    private String difficultyCd;     //난이도코드
    
    private String difficultyNm;     //난이도
    
    private String aerobic;          //유산소여부
    
    private String therapyCd;        //특수치료코드
    
    private String therapyNm;        //특수치료
    
    private double progress;         //진도율 
    
    private String surveyResultStr;  //설문결과 
    private List<SurveyResult> surveyResult;     //설문결과 
    
    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }  
}

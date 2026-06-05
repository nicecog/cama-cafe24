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
public class MonitorCoachingDTO {
	
    private int page = 1;
    private String searchType;           //조회유형(이름)
    private String searchText;           //조회 Valuue
    private String startDate;
    private String endDate;
    private Pagination pagination;

    private Long diseaseSeq;

    private Long acSeq;                  //사용자seq
    private Long dSeq;                   //병원seq

    private boolean paging = true;	
    
    private Long seq;                    //사용자seq

    private String name;                 //이름 
    
    private String birth;                //생년월일

    private Gender gender;               //성별 
    
    private String diseaseName;          //질환 
    
    private String diseaseTreatment;     //시기 
    
    private String userTypeNm;           //사용자유형명 
    
    private String categoryAa;            //수면
    
    private String categoryBb;            //식습관
    
    private String categoryCc;            //신체활동
    
    private String categoryDd;            //심리
    
    private String categoryEe;            //운동
    
    private String cancerProgressRate;    //암정보가이드 진도율 
    
    private String avgStep;              //걸음수평균 

    private String disease;              //질환관련json
    
    private String userTypeCd;           //사용자유형코드
    
    private String categoryCd;           //category유형코드 
    
    private String categoryNm;           //category유형명 
    
    private double progress;             //건강코칭진도율

    private String createdAt;            //최근사용일
    
    private String stepDayCd;            //진행일차코드 
    
    private String stepDayNm;            //진행일차명 
 
    private String progressTypeCd;       //카드유형코드  
    
    private String progressTypeNm;       //카드유형명  
    
    private String contentsInfo;         //컨텐츠주요내용 
    
    private String question;             //질문
    
    private Long answerChoiceSeq;        //답변seq
    
    private String answerChoice;         //답변 

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

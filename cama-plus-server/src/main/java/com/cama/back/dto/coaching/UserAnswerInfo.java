package com.cama.back.dto.coaching;

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
public class UserAnswerInfo {

	private String categoryCd;       //건강코칭 카테고리 코드

	private String categoryNm;       //건강코칭 카테고리명 

	private String stepDayCd;        //건강코칭 일차 코드

	private String progressTypeCd;   //건강코칭 진행 코드
	
	private int answerChoiceSeq;    //순번
	
    private String answerAddChoieYn; //카드추가질문답변여부(Y/N)

	private String answerChoice;     //답변

    //private int accountSeq;         //사용자Seq
	private String loginId;          //사용자LoginId
    
    private String accountName;     //사용자명 
    
    private int answerCnt;          //존재건수 
    
    private double progress;        //건강코칭진도율

    private int diseaseSeq;          //질환Seq

    private String diseaseName;          //질환 
    
    private String diseaseTreatment;    //시기 

    private String disease;              //질환관련json
    
    private String refVal1;
    
    private String refVal2;
    
    private String refVal3;
   
    private String refVal4;
    
    private String refVal5;
    
    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

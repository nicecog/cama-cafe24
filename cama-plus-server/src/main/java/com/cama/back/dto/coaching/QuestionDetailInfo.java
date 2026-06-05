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
public class QuestionDetailInfo {

	private String categoryCd;       //건강코칭 카테고리 코드

	private String stepDayCd;        //건강코칭 일차 코드

	private String progressTypeCd;   //건강코칭 진행 코드

	private int detailSeq;          //순번

	private String detailInfo;       //상세내용

	private String addDetailInfo;    //추가상세내용

    //private int accountSeq;         //사용자Seq
	private String loginId;          //사용자LoginId
    
    private String accountName;      //사용자명 


    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

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
public class ExerciseContentInfo {

	private String loginId;           //사용자LoginId
	private int    indexNum;          //운동순서
	private String exerciseTypeCd;    //운동종류코드
	private String difficultyCd;      //난이도코드
	private String engName;           //영문제목
	private String korName;           //한글제목
	private String url;               //유튜브링크
	    
    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

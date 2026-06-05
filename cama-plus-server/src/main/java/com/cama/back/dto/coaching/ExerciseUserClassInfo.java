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
public class ExerciseUserClassInfo {
	
	private String loginId;           //사용자LoginId
	private String cancerTypeCd;      //암유형코드
	private String exerciseProgramCd; //운동프로그램코드
	private String aerobic;           //유산소여부(Y/N)
	private String therapyCd;         //특수치료코드
	
	private int accountSeq;           //사용자Seq
	    
    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

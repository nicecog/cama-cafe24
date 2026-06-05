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
public class StepRequest {

	private Long seq;
	
	private String loginId;          //사용자LoginId
	
	private String executionDate;   //걸음수 등록일 

    private Long accountSeq;        //사용자seq 
    
    private String accountName;     //사용자

    private Long stepNum;           //걸음수 


    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

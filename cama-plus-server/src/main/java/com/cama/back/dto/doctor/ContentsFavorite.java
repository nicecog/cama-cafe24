package com.cama.back.dto.doctor;

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
public class ContentsFavorite {

	private Long seq;
	
	private String loginId;          //사용자LoginId
	
	private String type;             //처리유형(C:추가 ,D:삭제)
	
	private Long accountSeq;
    
	private Long contentsSeq;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

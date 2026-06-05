package com.cama.back.domain.coaching;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import com.cama.back.dto.coaching.SurveyResult;
import com.fasterxml.jackson.annotation.JsonFormat;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "seq")
public class CoachingExerciseSurveyResultHst {
	
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long seq;                //Seq
	
    private Long accountSeq;         //사용자Seq
    
    private String cancerTypeCd;     //암유형코드

    private String difficultyCd;     //난이도코드
    
    private String aerobic;          //유산소여부
    
    private String therapyCd;        //특수치료코드
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<SurveyResult> surveyResult;
    
    @Column(updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;

    @Column(updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updatedAt;
}

package com.cama.back.domain.wellbeing;

import com.cama.back.dto.track.Disease;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Entity
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(of = "seq")
public class CmWellbeingResources {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long seq;
    
    private String wellbeingCategoryCd;
    
    private String companyName;
    
    private String companyDescription;
    
    private String title;
    
    private String contents;
    
    private String thumbnail;
    
    private String address;
    
    private String phoneNumber;
    
    private String homepage;
    
    private String sns;
    
    @JsonIgnore
    @Column(name = "is_enabled")
    private boolean enabled;  
    
    private Long priority;
   
    private String lang;

    @Column(updatable = false, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime createdAt;

    @Column(updatable = true, insertable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
    private LocalDateTime updatedAt;

}

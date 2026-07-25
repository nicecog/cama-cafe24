package com.cama.back.dto.account;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientProfileUpdateRequest {

    private String loginId;
    private String name;
    private String phone;
    /** 선택. 빈 문자열이면 이메일 삭제 */
    private String email;
    private String birth;
    /** MALE / FEMALE */
    private String gender;
}

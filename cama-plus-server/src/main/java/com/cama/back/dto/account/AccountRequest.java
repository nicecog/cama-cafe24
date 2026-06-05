package com.cama.back.dto.account;

import com.cama.back.domain.account.Gender;
import com.cama.back.domain.account.SignType;
import com.cama.back.domain.firebase.Firebase;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccountRequest {

    @Schema(description = "로그인 이메일")
    private String email;

    @Schema(description = "아임포트 impUid")
    private String impUid;

    @Schema(description = "가입형태")
    private SignType signType;

    @Schema(description = "패스워드")
    private String password;   // 패스워드

    @Schema(description = "닉네임(SNS)")
    private String nickName;

    @Schema(description = "Firebase 정보")
    private Firebase firebase;
    

    @Schema(description = "로그인id")
    private String loginId;

    @Schema(description = "이름")
    private String name;

    @Schema(description = "전화번호")
    private String phone;

    @Schema(description = "성별")
    private Gender gender;

    @Schema(description = "생년월일")
    private String birthday;
    
    @Schema(description = "언어")
    private String lang;

    @Override
    public String toString() {
        return new ToStringBuilder(this, ToStringStyle.JSON_STYLE).toString();
    }

}

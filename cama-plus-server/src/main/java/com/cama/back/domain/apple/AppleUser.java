package com.cama.back.domain.apple;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AppleUser {

    private String authorizationCode;

    private String email;

    private NSPersonNameComponents fullName;

    private String identityToken;

    private String state;

    private String user;

}

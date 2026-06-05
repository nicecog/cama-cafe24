package com.cama.back.domain.apple;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class NSPersonNameComponents {

    private String familyName;

    private String givenName;

    private String namePrefix;

    private String nameSuffix;

    private String nickName;

    private NSPersonNameComponents phoneticRepresentation;

}

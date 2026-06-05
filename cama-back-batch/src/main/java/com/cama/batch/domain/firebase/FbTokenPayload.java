package com.cama.batch.domain.firebase;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@AllArgsConstructor
public class FbTokenPayload {

    private String email;

    private String name;

    private String picture;

}

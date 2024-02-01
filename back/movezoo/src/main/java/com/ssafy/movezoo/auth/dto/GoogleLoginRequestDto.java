package com.ssafy.movezoo.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GoogleLoginRequestDto {
    private String googleJwt;
}

package com.ssafy.movezoo.auth.dto;

import com.ssafy.movezoo.user.domain.User;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequestDto {
    private String userEmail;
    private String password;

}

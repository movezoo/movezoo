package com.ssafy.racing.auth.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    private String userEmail;
    private String password;
}

package com.ssafy.movezoo.user.dto;

import com.ssafy.movezoo.user.domain.User;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.lang.reflect.Constructor;

@Getter
@Setter
@NoArgsConstructor
public class UserJoinRequestDto {

    private String userEmail;

    private String password;

    private String nickname;

    public UserJoinRequestDto(String userEmail, String password, String nickname){
        this.userEmail = userEmail;
        this.password = password;
        this.nickname = nickname;
    }

}

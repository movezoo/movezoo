package com.ssafy.racing.user.dto;

import com.ssafy.racing.user.domain.User;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
public class UserJoinRequest {
    @NotBlank(message = "이메일이 비어있습니다.")
    private String email;

    @NotBlank(message = "비밀번호가 비어있습니다.")
    private String password;

    @NotBlank(message = "닉네임이 비어있습니다.")
    private String nickname;


    // Dto -> Entity
    public User toEntity(String email, String password, String nickname){
        return User.builder()
                .userEmail(this.email)
                .password(this.password)
                .nickname(this.nickname)
                .build();
    }
}

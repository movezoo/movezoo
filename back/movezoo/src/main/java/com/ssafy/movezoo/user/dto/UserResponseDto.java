package com.ssafy.movezoo.user.dto;

import com.ssafy.movezoo.user.domain.User;
import com.ssafy.movezoo.user.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class UserResponseDto {

    private int userId;

    private String userEmail;

    private String googleUserEmail;

    private String nickname;

    private int coin;

    private String profileImgUrl;

    public UserResponseDto(User user){
        this.userId = user.getUserId();
        this.userEmail = user.getUserEmail();
        this.googleUserEmail = user.getGoogleUserEmail();
        this.nickname = user.getNickname();
        this.coin = user.getCoin();
        this.profileImgUrl = user.getProfileImgUrl();
    }


    @Override
    public String toString() {
        return "UserResponseDto{" +
                "userId=" + userId +
                ", userEmail='" + userEmail + '\'' +
                ", googleUserEmail='" + googleUserEmail + '\'' +
                ", nickname='" + nickname + '\'' +
                ", coin=" + coin +
                ", profileImgUrl='" + profileImgUrl + '\'' +
                '}';
    }
}

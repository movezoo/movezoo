package com.ssafy.movezoo.friendship.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FriendResponseDto {
    private Integer userId;
    private String nickname;
    private String profileImgUrl;

}

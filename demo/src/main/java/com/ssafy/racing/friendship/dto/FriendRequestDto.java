package com.ssafy.racing.friendship.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FriendRequestDto {
    private Integer friendId;
    private boolean allow;
}

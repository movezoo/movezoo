package com.ssafy.movezoo.game.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class
CreateRoomRequestDto {

    private String roomSessionId;

    private String roomTitle;

    private int roomMode;

    private int maxRange;

    private String roomPassword;

    private int trackId;

}

package com.ssafy.movezoo.game.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
public class CreateRoomRequestDto {

    private String roomSessionId;

    private String roomTitle;

    private int roomMode;

    private int maxRange;

    private String roomPassword;

}

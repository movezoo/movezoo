package com.ssafy.movezoo.game.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LapTimeRequestDto {
    private int userId;
    private int trackId;
    private Double record;
}

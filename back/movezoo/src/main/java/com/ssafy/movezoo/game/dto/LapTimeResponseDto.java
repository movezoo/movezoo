package com.ssafy.movezoo.game.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LapTimeResponseDto {
    private int trackId;
    private String nickName;
    private String profileImgUrl;
    private Double record;
}

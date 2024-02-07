package com.ssafy.movezoo.openvidu.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ExitRoomDto {
    private String sessionId;
    private String connectionId;
}

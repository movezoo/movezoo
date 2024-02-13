package com.ssafy.movezoo.game.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@Setter
@Builder
public class RoomResponseDto {

    private Long roomId;
    private String roomSessionId;
    private boolean secretRoom;
    private String secretRoomPassword;
    private boolean roomStatus;
    private int trackId;
    private String roomTitle;
    private int roomMode;
    private int currentUserCount;
    private int maxUserCount;
    private int roomMasterId;
}

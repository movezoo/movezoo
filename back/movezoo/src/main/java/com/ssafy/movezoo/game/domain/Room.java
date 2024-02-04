package com.ssafy.movezoo.game.domain;

import jakarta.persistence.Id;
import jakarta.persistence.criteria.CriteriaBuilder;
import lombok.Builder;
import lombok.Getter;
import org.springframework.data.redis.core.RedisHash;

@Getter
@RedisHash("room")
public class Room {
    @Id
    private String roomId;
    private String roomSessionId;
    private boolean secretRoom;
    private String secretRoomPassword;
    private boolean roomStatus;
    private String trackId;
    private String roomName;
    private String roomMode;
    private int maxRange;

    @Builder
    public Room(String roomId, String roomSessionId, boolean secretRoom, String secretRoomPassword, boolean roomStatus, String trackId, String roomName, String roomMode, int maxRange) {
        this.roomId = roomId;
        this.roomSessionId = roomSessionId;
        this.secretRoom = secretRoom;
        this.secretRoomPassword = secretRoomPassword;
        this.roomStatus = roomStatus;
        this.trackId = trackId;
        this.roomName = roomName;
        this.roomMode = roomMode;
        this.maxRange = maxRange;
    }
}

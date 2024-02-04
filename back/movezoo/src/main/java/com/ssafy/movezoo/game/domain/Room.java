package com.ssafy.movezoo.game.domain;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.annotation.Id;  // redis 사용 시 jpa @Id import하지 않도록 주의!
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@RedisHash(value = "room")    // 유효시간 x
public class Room {
    @Id
    private Long id;  // 오로지 구분을 위한 의미없는 문자열

    @Indexed
    private String roomSessionId;   // 값을 찾을 때 사용    => 수정하기!!

    private boolean secretRoom;
    private String secretRoomPassword;
    private boolean roomStatus;
    private int trackId;
    private int roomMode;
    private int roomMasterId;
    private String roomTitle;
    private int currentUserCount;
    private int maxUserCount;

    // 비밀방
    public Room(int userId, String roomSessionId, String roomTitle, int roomMode, int maxUserCount, String secretRoomPassword){
        this.roomSessionId = roomSessionId;
        this.secretRoom = true;
        this.secretRoomPassword = secretRoomPassword;
        this.roomStatus = false;    // 시작 x
        this.trackId = 1;           // 1번 맵
        this.roomMode = roomMode;
        this.roomMasterId = userId;
        this.roomTitle = roomTitle;
        this.currentUserCount = 1;
        this.maxUserCount = maxUserCount;
    }

    // 일반방
    public Room(int userId, String roomSessionId, String roomTitle, int roomMode, int maxUserCount){
        this.roomSessionId = roomSessionId;
        this.secretRoom = false;
        this.secretRoomPassword = null;
        this.roomStatus = false;    // 시작 x
        this.trackId = 1;           // 1번 맵
        this.roomMode = roomMode;
        this.roomMasterId = userId;
        this.roomTitle = roomTitle;
        this.currentUserCount = 1;
        this.maxUserCount = maxUserCount;
    }

}

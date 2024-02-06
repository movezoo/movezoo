package com.ssafy.movezoo.game.controller;

import com.ssafy.movezoo.game.dto.RoomResponseDto;
import lombok.RequiredArgsConstructor;
import com.ssafy.movezoo.game.domain.Room;
import com.ssafy.movezoo.game.dto.CreateRoomRequestDto;
import com.ssafy.movezoo.game.dto.RoomSessionIdDto;
import com.ssafy.movezoo.game.serivce.RedisService;
import com.ssafy.movezoo.global.dto.SimpleResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class RedisController {
    private final RedisService redisService;

    // 방 만들기
    @PostMapping("/room")
    public ResponseEntity<RoomResponseDto> createRoom(Authentication authentication, @RequestBody CreateRoomRequestDto dto){
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
        simpleResponseDto.setSuccess(true);

        int userId = Integer.parseInt(authentication.getName());

        dto.setRoomSessionId(makeRandomSessionId());
        // roomSessionId 중복 체크 필요
        if (redisService.isDuplicateRoomSessionId(dto.getRoomSessionId())){  // 세션 아이디가 중복이라면
            System.out.println("세션 아이디가 중복입니다.");
            simpleResponseDto.setMsg("세션 아이디가 중복입니다.");
            simpleResponseDto.setSuccess(false);

            return ResponseEntity.badRequest().body(null);
        }

        try {
            if (dto.getRoomPassword() != null && dto.getRoomPassword().equals("")){     // 비밀방일 경우
                Room room = redisService.createSecretRoom(userId, dto);
                log.info("make s room {}",room);
                simpleResponseDto.setMsg("비밀방 생성 성공");

                RoomResponseDto roomResponseDto = RoomResponseDto.builder()
                        .roomId(room.getId())
                        .roomSessionId(room.getRoomSessionId())
                        .secretRoom(room.isSecretRoom())
                        .secretRoomPassword(room.getSecretRoomPassword())
                        .roomStatus(room.isRoomStatus())
                        .trackId(room.getTrackId())
                        .roomTitle(room.getRoomTitle())
                        .roomMode(room.getRoomMode())
                        .currentUserCount(room.getCurrentUserCount())
                        .roomMasterId(room.getRoomMasterId())
                        .build();
                return ResponseEntity.status(HttpStatus.OK).body(roomResponseDto);
            } else {
                Room room = redisService.createRoom(userId, dto);
                RoomResponseDto roomResponseDto = RoomResponseDto.builder()
                        .roomId(room.getId())
                        .roomSessionId(room.getRoomSessionId())
                        .secretRoom(room.isSecretRoom())
                        .secretRoomPassword(room.getSecretRoomPassword())
                        .roomStatus(room.isRoomStatus())
                        .trackId(room.getTrackId())
                        .roomTitle(room.getRoomTitle())
                        .roomMode(room.getRoomMode())
                        .currentUserCount(room.getCurrentUserCount())
                        .roomMasterId(room.getRoomMasterId())
                        .build();
                log.info("make room {}", room);
                return ResponseEntity.status(HttpStatus.OK).body(roomResponseDto);
            }

        } catch (Exception e){
            e.printStackTrace();
            simpleResponseDto.setMsg("방 생성 실패");
            simpleResponseDto.setSuccess(false);

            return ResponseEntity.badRequest().body(null);
        }
    }

    private String makeRandomSessionId(){
        return UUID.randomUUID().toString();
    }

    // 방 목록
    @GetMapping("/room")
    public List<Room> getRoomList(){
        return redisService.getRoomList();
    }

    // 방 들어가기
    @PatchMapping("/room/enter")
    public ResponseEntity<SimpleResponseDto> enterRoom(@RequestBody RoomSessionIdDto dto){
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();

        if (redisService.enterRoom(dto.getRoomSessionId())){
            simpleResponseDto.setSuccess(true);
            simpleResponseDto.setMsg("방 입장 성공");
            return ResponseEntity.ok().body(simpleResponseDto);
        } else {
            simpleResponseDto.setSuccess(false);
            simpleResponseDto.setMsg("방 입장 실패");
            return ResponseEntity.badRequest().body(simpleResponseDto);
        }
    }

    // 방 나가기 (방장 -> 방 폭파 / 방장 X -> 방 퇴장)
    @PatchMapping("/room/exit")
    public ResponseEntity<SimpleResponseDto> exitRoom(Authentication authentication, @RequestBody RoomSessionIdDto dto){
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();

        int userId = Integer.parseInt(authentication.getName());

        // 나가려는 방 정보를 가져온다.
        if (redisService.getRoomInfoBySessionId(dto.getRoomSessionId()).isPresent()){
            Room room = redisService.getRoomInfoBySessionId(dto.getRoomSessionId()).get();

            // 나가려는 사용자가 방장 -> 방 삭제
            if (room.getRoomMasterId() == userId){
                redisService.deleteRoom(room.getId());
                simpleResponseDto.setMsg("방장 퇴장 - 방 폭파 성공");
            } else {    // 나려는 사용자가 방장 X -> 퇴장
                redisService.exitRoom(room.getId());
                simpleResponseDto.setMsg("방 나가기 성공");
            }
        }

        simpleResponseDto.setSuccess(true);
        return ResponseEntity.ok().body(simpleResponseDto);
    }

    // 방 삭제
    @GetMapping("/room/remove")
    public ResponseEntity<SimpleResponseDto> removeRoom(@RequestParam("sessionId") String roomSessionId){
        Room room = redisService.getRoomInfoBySessionId(roomSessionId).get();

        if (room != null){
            redisService.deleteRoom(room.getId());
        }

        SimpleResponseDto simpleResponseDto = new SimpleResponseDto(true, "방 삭제 성공");
        return ResponseEntity.ok().body(simpleResponseDto);
    }


    // 방 제목 및 모드로 검색
    @GetMapping("/room-filter")
    public List<Room> searchByTitleAndMode(
            @RequestParam(name = "title", required = false) String roomTitle,
            @RequestParam(name = "mode", required = false) Integer roomMode){

        System.out.println("roomMode: " + roomMode+ " , roomTitle: "+roomTitle);

        List<Room> roomList = getRoomList();

        // mode 필터링
        if (roomMode != null){
            System.out.println("Mode Filtering");
            int size = roomList.size();
            for (int i = size - 1; i >= 0; i--){
                Room currRoom = roomList.get(i);
                if (currRoom.getRoomMode() != roomMode)
                    roomList.remove(currRoom);
            }
        }

//        System.out.println("--------------------------Mode Filter--------------------------");
//        for (Room room : roomList){
//            System.out.println(room.toString()+ "    ");
//        }

        // title 필터링
        if (roomTitle != null){
            System.out.println("Title Filtering");
            int size = roomList.size();
            for (int i = size - 1; i >= 0; i--){
                Room currRoom = roomList.get(i);
                if (!currRoom.getRoomTitle().equals(roomTitle))
                    roomList.remove(currRoom);
            }
        }
//        System.out.println("--------------------------Title Filter--------------------------");
//        for (Room room : roomList){
//            System.out.println(room.toString()+ "    ");
//        }

        return roomList;
    }

    public ResponseEntity<SimpleResponseDto> deleteAllRoom(){
        redisService.deleteAllRoom();

        SimpleResponseDto simpleResponseDto= new SimpleResponseDto();
        simpleResponseDto.setSuccess(true);
        simpleResponseDto.setMsg("all room delete");
        return ResponseEntity.status(HttpStatus.OK).body(simpleResponseDto);
    }
}

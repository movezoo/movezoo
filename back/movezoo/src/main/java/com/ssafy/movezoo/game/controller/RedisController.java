package com.ssafy.movezoo.game.controller;

import com.ssafy.movezoo.game.dto.RoomResponseDto;
import io.openvidu.java.client.*;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import com.ssafy.movezoo.game.domain.Room;
import com.ssafy.movezoo.game.dto.CreateRoomRequestDto;
import com.ssafy.movezoo.game.dto.RoomSessionIdDto;
import com.ssafy.movezoo.game.serivce.RedisService;
import com.ssafy.movezoo.global.dto.SimpleResponseDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api")
public class RedisController {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;

    private final RedisService redisService;
    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    // 방 만들기
    @PostMapping("/room")
    public ResponseEntity<RoomResponseDto> createRoom(Authentication authentication, @RequestBody CreateRoomRequestDto dto) throws OpenViduJavaClientException, OpenViduHttpException {
        log.info("make room {}",dto);
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();
        simpleResponseDto.setSuccess(true);

        int userId = Integer.parseInt("1");

        //랜덤아이디 생성
        String randomSessionId = makeRandomSessionId();
        dto.setRoomSessionId(randomSessionId);

        //openvidu session create start
        Map<String, Object> params = new HashMap<>();
        params.put("customSessionId", randomSessionId);

        //SessionProperties -> openvidu세션을 생성하기 위한 속성을 정의하는 클래스
        //세션값은 내가 읨의로 부여
        SessionProperties properties = SessionProperties.fromJson(params).build();
        Session session = openvidu.createSession(properties);

        log.info("room session info {}", session.getSessionId());
        //openvidu session create end

        // roomSessionId 중복 체크 필요
        if (redisService.isDuplicateRoomSessionId(dto.getRoomSessionId())){  // 세션 아이디가 중복이라면
            System.out.println("세션 아이디가 중복입니다.");
            simpleResponseDto.setMsg("세션 아이디가 중복입니다.");
            simpleResponseDto.setSuccess(false);

            return ResponseEntity.badRequest().body(null);
        }

        try {
            dto.setMaxRange(4);
            if (dto.getRoomPassword() != null && !dto.getRoomPassword().isEmpty()){     // 비밀방일 경우
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
        List<Room> roomList = redisService.getRoomList();
        roomList.sort(new Comparator<Room>() {
            @Override
            public int compare(Room o1, Room o2) {
                return o1.getCreationDateTime().compareTo(o2.getCreationDateTime());
            }
        });
        return roomList;
    }

















    //initializeSession함수로 생성된 세션으로 연결
    @PostMapping("/api/openvidu/sessions/{sessionId}/connections")
    public ResponseEntity<String> createConnection(@PathVariable("sessionId") String sessionId,
                                                   @RequestBody(required = false) Map<String, Object> params)
            throws OpenViduJavaClientException, OpenViduHttpException {

        log.info("/api/sessions/{} ", sessionId);

        //sessionId 사용하여 OpenVidu에서 해당 세션 get
        Session session = openvidu.getActiveSession(sessionId);

        //세션 존재하지 않으면 404 반환
        if (session == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        //프론트에서 넘어온 json데이터를 사용하여 ConnectionProperties객체생성, openvidu session에 연결할때 필요
        ConnectionProperties properties = ConnectionProperties.fromJson(params).build();

        log.info("{}", params);


        /**
         * 방을 만들어서 접속시 이미 redis에 생성을 했으므로 sessionId로 찾기 가능
         */
        redisService.getRoomInfoBySessionId(sessionId);

        //openvidu session에 연결생성
        Connection connection = session.createConnection(properties);
        return new ResponseEntity<>(connection.getToken(), HttpStatus.OK);
    }


    // 방 들어가기
    @PostMapping("/room/enter")
    public ResponseEntity<String> enterRoom(@RequestBody RoomSessionIdDto dto) throws OpenViduJavaClientException, OpenViduHttpException {
        log.info("room enter info {} ", dto);
        SimpleResponseDto simpleResponseDto = new SimpleResponseDto();

        String sessionId = dto.getRoomSessionId();
        String nickname = dto.getNickname();


        //sessionId 사용하여 OpenVidu에서 해당 세션 get
        Session session = openvidu.getActiveSession(sessionId);

        if(session == null || redisService.isPlay(sessionId)){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }

        Optional<Room> roomInfoBySessionId = redisService.getRoomInfoBySessionId(sessionId);
        if(roomInfoBySessionId.isPresent()) System.out.println(roomInfoBySessionId.get().toString());
        if (redisService.enterRoom(sessionId)){
            System.out.println("asdasdasd");
            //프론트에서 넘어온 json데이터를 사용하여 ConnectionProperties객체생성, openvidu session에 연결할때 필요
            Map<String, Object> params = new HashMap<>();
            params.put("nickname",nickname);
            ConnectionProperties properties = ConnectionProperties.fromJson(params).build();

            //openvidu session에 연결생성
            Connection connection = session.createConnection(properties);
            return ResponseEntity.status(HttpStatus.OK).body(connection.getToken());
        } else {
            System.out.println("Tlqkf");
            simpleResponseDto.setSuccess(false);
            simpleResponseDto.setMsg("방 입장 실패");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PatchMapping("/room/start")
    public void changeRoomStatus(@RequestBody(required = true) Map<String, Object> params){
        String sessionId = (String) params.get("roomSessionId");
        redisService.changRoomStatus(sessionId);
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
